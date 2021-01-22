import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import * as THREE from 'threear/node_modules/three';
import * as THREEAR from 'threear';
import { ARMarker, markersEqual } from 'src/app/markers';
import { Observable } from 'rxjs';

/**
 * The state of a marker
 */
export interface MarkerState {
  barcodeValue: number;
  found: boolean;
  screenPosition: Observable<{
    xPixelsCropped: number;
    yPixelsCropped: number;
    xPixels: number;
    yPixels: number;
    xPercent: number;
    yPercent: number;
  }>;
}

const ArResolution = {
  width: 640,
  height: 480
};

/**
 * The ArViewComponent contains a THREE scene and THREEAR setup to show images on barcode markers.
 */
@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.scss']
})
export class ArViewComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /**
   * Input  of ar view component
   */
  @Input() markers: ARMarker[] = [];

  /**
   * Outputs an event whenever a marker is found.
   */
  @Output() foundMarker = new EventEmitter<MarkerState | null>();

  // https://github.com/stemkoski/AR-Examples/blob/master/texture.html
  // https://github.com/JamesMilnerUK/THREEAR/blob/master/examples/basic-barcode.html

  // Setup objects
  scene: THREE.Scene; // The Three scene, where the groups to display on markers are held
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  deltaTime = 0;
  totalTime = 0;
  source: THREEAR.Source;

  controller: THREEAR.Controller;

  arReady = false;
  disposeQueued = false;

  lastActiveMarker: number;

  constructor() {

  }


  // Provides a reference for the canvas element
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas', { static: true })
  private canvasRef: ElementRef;


  // Provide a reference for the container
  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container', { static: true })
  private containerRef: ElementRef;

  /**
   * Given an object in AR, return its x and y position.
   *
   * The position is measured from the bottom-left corner of the AR canvas;
   * x increases to the right, and y increases to the top.
   *
   * x is returned as a percentage of the width of the AR canvas.
   * y is returned as a percentage of the height of the AR canvas.
   */
  private toScreenPosition(obj: THREE.Object3D) {
    const vector = new THREE.Vector3();

    const canvas = ArResolution;

    const widthHalf = 0.5 * canvas.width;
    const heightHalf = 0.5 * canvas.height;
    const canvasAspectRatio = canvas.width / canvas.height; // Should be 4/3

    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let croppedWidth = canvas.width;
    let croppedHeight = canvas.height;

    if (containerAspectRatio < canvasAspectRatio) {
      croppedWidth = (canvas.height / containerHeight) * containerWidth;
    } else {
      croppedHeight = (canvas.width / containerWidth) * containerHeight;
    }

    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.camera);

    // Convert from AR units to px
    const xPixels = ( vector.x * widthHalf ) + widthHalf;
    const yPixels = ( vector.y * heightHalf ) + heightHalf;

    const xPixelsCropped = xPixels - ((canvas.width - croppedWidth) * 0.5);
    const yPixelsCropped = yPixels - ((canvas.height - croppedHeight) * 0.5);

    // Convert from px to %
    const xPercent = 100 * xPixelsCropped / croppedWidth;
    const yPercent = 100 * yPixelsCropped / croppedHeight;

    return {
      xPixelsCropped,
      yPixelsCropped,
      xPixels,
      yPixels,
      xPercent,
      yPercent
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initAR().then(() => { // init ar

      if (this.disposeQueued) {
        return;
      }

      // Add initial set of markers passed into the component
      if (this.markers) {
        this.markers.forEach((marker) => this.addMarker(marker));
      }

      // Setup AR events
      this.setupEvents();

      // Set flag that AR is ready
      this.arReady = true;
    });
  }


  /**
   * Setup the canvas, camera, and basic AR library
   * @returns a promise that resolves when AR is ready.
   */
  private initAR(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.clock = new THREE.Clock(); // setup the clock for keeping track of frametimes

      this.scene = new THREE.Scene(); // create the main scene

      // Set lighting
      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
      this.scene.add(ambientLight);

      // Setup camera
      this.camera = new THREE.Camera();
      this.scene.add(this.camera);

      // Setup renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: this.canvas // Point the renderer at the canvas element in the HTML
      });

      this.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
      this.renderer.setSize(ArResolution.width, ArResolution.height); // TODO: resize to entire component size

      // Setup the THREEAR Source with the parent div and the renderer and camera we setup
      this.source = new THREEAR.Source({
        parent: this.container,
        renderer: this.renderer,
        camera: this.camera,
        sourceWidth: ArResolution.width,
        sourceHeight: ArResolution.height,
        displayWidth: ArResolution.width,
        displayHeight: ArResolution.height,
      });

      // Initialize THREEAR
      THREEAR.initialize(
        {
          source: this.source,
          // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
          detectionMode: 'mono_and_matrix',

          // type of matrix code - valid iif detectionMode end with 'matrix' -
          // [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
          matrixCodeType: '4x4_BCH_13_9_3',

          // timeout for setting a marker as lost when it is no longer seen
          // default was 1000
          lostTimeout: 100,

          positioning: {
            // turn on/off camera smoothing
            smooth: false, // note: turning this off seems to make the tracking much better

            // number of matrices to smooth tracking over, more = smoother but slower follow
            smoothCount: 5,

            // distance tolerance for smoothing, if smoothThreshold # of matrices are under tolerance, tracking will stay still
            smoothTolerance: 0.01,

            // threshold for smoothing, will keep still unless enough matrices are over tolerance
            smoothThreshold: 2
          },

          // tune the maximum rate of pose detection in the source image
          maxDetectionRate: 60,

          // resolution of at which we detect pose in the source image
          canvasWidth: ArResolution.width,
          canvasHeight: ArResolution.height,

          // the patternRatio inside the artoolkit marker - artoolkit only
          patternRatio: 0.5,

          // enable image smoothing or not for canvas copy - default to true
          // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
          imageSmoothingEnabled: true
        }
      ).then((controller: THREEAR.Controller) => {
        // Initialize returns a controller, set this.controller to that so we have a reference to it
        this.controller = controller;

        // Call animate for the first time
        this.animate();

        // Resolve the initAR Promise
        resolve();

      }).catch(error => {
        reject(error);
      });
    });
  }


  /**
   * Animation and AR updating loop
   */
  private animate() {
    // Stop the animate loop when the controller has been disposed
    if (this.disposeQueued) {
      this.dispose();
      return;
    }

    // Setup the next call
    this.deltaTime = this.clock.getDelta(); // Calculate the time delta between frames
    this.totalTime += this.deltaTime; // Add to the current timestamp

    // Update the state of the THREEAR Controller
    this.controller.update(this.source.domElement);

    // Render the markers
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => { this.animate(); });
  }


  /**
   * Adds a marker to the scene and controller
   * @param barcodeValue the number of the barcode for the marker
   * @param imgPath the path to the image to display for the marker
   */
  public addMarker(marker: ARMarker): THREEAR.BarcodeMarker {

    // Setup the three group for this marker
    const markerGroup = new THREE.Group();
    // Add the group to the scene that contains all the markers
    this.scene.add(markerGroup);

    // Create the geometry the texture will be placed on
    const geometry1 = new THREE.PlaneBufferGeometry(1.5, 1.5, 4, 4);

    // Create the basic image texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load(marker.imgPath);
    const material1 = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    // create a mesh of the image texture on the geometry
    const mesh1 = new THREE.Mesh(geometry1, material1);

    // Rotate the mesh so the image is flat on the marker
    mesh1.rotation.x = -Math.PI / 2;

    // Add the mesh to the group
    markerGroup.add(mesh1);

    // Create the THREEAR BarcodeMarker object for this marker
    const barcodeMarker = new THREEAR.BarcodeMarker({
      barcodeValue: marker.barcodeValue,
      markerObject: markerGroup,
      size: 1,
      minConfidence: 0.2
    });



    // Start tracking the marker
    this.controller.trackMarker(barcodeMarker);

    return barcodeMarker;
  }

  /**
   * Given a found barcode marker, return how far away the marker is from
   * the center.
   *
   * Specifically, this number is the distance, in three-space, from the
   * "straight ahead" line to the center of the barcode marker. (The units
   * are arbitrary.)
   *
   * If it helps: imagine a metal pole is sticking out of your camera.
   * Use a ruler to measure the distance from the pole to the marker.
   * This function calculates that distance
   */
  private calculateObjectDistance(object: THREE.Object3D): number {
    const { x, y, z } = object.position;
    return Math.sqrt(x * x + y * y);
  }

  private markerFoundOrLost() {
    const activeMarkers = this.controller.markers.barcode.filter(marker => marker.found);

    if (activeMarkers.length > 0) {
      const activeMarker = activeMarkers.length === 1 ? activeMarkers[0] : activeMarkers
        .map(marker => ({ ...marker, distance: this.calculateObjectDistance(marker.markerObject) }))
        .reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);

      if (this.lastActiveMarker !== activeMarker.barcodeValue) {
        this.foundMarker.emit({
          barcodeValue: activeMarker.barcodeValue,
          found: true,
          screenPosition: new Observable(obs => {
            obs.next(this.toScreenPosition(activeMarker.markerObject));
            obs.complete();
          })
        });
        this.lastActiveMarker = activeMarker.barcodeValue;
      }
    } else {
      this.foundMarker.emit(null);
      this.lastActiveMarker = null;
    }

  }

  /**
   * Sets up marker events
   */
  private setupEvents() {
    this.controller.addEventListener('markerFound', () => {
      this.markerFoundOrLost();
    });
    this.controller.addEventListener('markerLost', () => {
      this.markerFoundOrLost();
    });
  }

  /**
   * Updates existing markers or adds new ones based on a list of markers that have changed.
   * @param changedMarkers the markers that have been changed and need to be updated or added
   */
  private updateMarkers(changedMarkers: ARMarker[]) {
    // Loop through changed markers
    for (const changedMarker of changedMarkers) {

      // Get the current marker with the same barcode value as the current changed marker if it exists
      const oldMarker = this.controller.markers.barcode.find((value) =>
        changedMarker.barcodeValue === value.barcodeValue);

      // If there is already a marker for this ID
      if (oldMarker) {
        // Find the existing marker's mesh
        const object = oldMarker.markerObject as THREE.Group;
        const mesh = object.children[0] as THREE.Mesh;

        // Replace the existing marker's texture with a new one from the changed image path.
        const loader = new THREE.TextureLoader();
        const texture = loader.load(changedMarker.imgPath);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.map = texture;

      } else {
        // If there is not an existing marker for the ID, add a new one.
        this.addMarker(changedMarker);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if there is a change to the markers and make sure AR has started
    if (typeof changes.markers !== 'undefined' && this.arReady) {
      const change = changes.markers;

      // We don't want to do this on the first change because that is when we are already setting the markers
      if (change.previousValue) {
        const current = change.currentValue as ARMarker[];
        const previous = change.previousValue as ARMarker[];

        // Get which markers have changed
        const diff = current.filter(m => !previous.some(n => markersEqual(m, n)));

        // Send the markers that have been changed to updateMarkers to be updated or added.
        this.updateMarkers(diff);
      } else {
        this.updateMarkers(change.currentValue as ARMarker[]);
      }
    }

  }


  private dispose() {
    this.controller?.markers.barcode.forEach((marker) => {
      this.scene?.remove(marker.markerObject);
    });

    if (this.source?.domElement instanceof HTMLVideoElement && this.source?.domElement.srcObject instanceof MediaStream) {
      this.source.domElement.srcObject.getTracks().forEach(track => track.stop());
    }

    if (this.source.domElement.parentNode) {
      this.source?.dispose();
    }
    this.controller?.dispose();
    this.renderer?.renderLists.dispose();
    this.renderer?.dispose();
  }

  ngOnDestroy() {
    // Just set some flags. The next time a function like `animate()` or
    // `updateMarkers` gets called, it'll check these flags and know to shut
    // down.
    this.disposeQueued = true;
    this.arReady = false;
  }

}
