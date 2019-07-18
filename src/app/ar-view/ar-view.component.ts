import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, SimpleChange, SystemJsNgModuleLoader } from '@angular/core';
import * as THREE from 'three';
import * as THREEAR from 'threear';
import Info from 'info-monitor';

/**
 * A barcode marker for AR
 */
export interface ARMarker {
  barcodeValue: number;
  imgPath: string;
}

/**
 * The state of a marker
 */
export interface MarkerState {
  barcodeValue: number; 
  found: boolean;
}

/**
 * The ArViewComponent contains a THREE scene and THREEAR setup to show images on barcode markers.
 */
@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.scss']
})
export class ArViewComponent implements OnInit {
  
  /**
   * Input  of ar view component
   */
  @Input() markers: ARMarker[];

  /**
   * Turn on debug mode
   */
  @Input() debug?: boolean = false;
  
  /**
   * Outputs an event whenever a marker is found.
   */
  @Output() onMarkerStates = new EventEmitter<MarkerState[]>();
  
  //https://github.com/stemkoski/AR-Examples/blob/master/texture.html
  //https://github.com/JamesMilnerUK/THREEAR/blob/master/examples/basic-barcode.html
  
  //Setup objects
  scene: THREE.Scene; //The Three scene, where the groups to dipslay on markers are held
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  deltaTime: number = 0;
  totalTime: number = 0;
  source: THREEAR.Source;
  
  controller: THREEAR.Controller;

  arReady: boolean = false;
  
  monitor1: Info;
  monitor2: Info;
  monitor3: Info;
  
  constructor() {
    
  }
  

  // Provides a reference for the canvas element
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas', {static: true}) 
  private canvasRef: ElementRef;
  

  //Provide a reference for the container
  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }
  
  @ViewChild('container', {static: true}) 
  private containerRef: ElementRef;
  
  
  @ViewChild('monitorcontainer', {static: true})
  private monitorContainerRef: ElementRef;

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.initAR().then(() => { //init ar

      //Set flag that AR is ready
      this.arReady = true;

      //Setup AR events
      this.setupEvents();

      //Add initial set of markers passed into the component
      this.markers.forEach((marker) => this.addMarker(marker));
    });
  }


  /**
   * Setup the canvas, camera, and basic AR library
   * @returns a promise that resolves when AR is ready.
   */
  private initAR() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.clock = new THREE.Clock(); //setup the clock for keeping track of frametimes
      
      this.scene = new THREE.Scene(); //create the main scene

      //Set lighting
      let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 ); 
      this.scene.add( ambientLight ); 
      
      //Setup camera
      this.camera = new THREE.Camera();
      this.scene.add(this.camera);

      //Setup renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias : true,
        alpha: true,
        canvas: this.canvas //Point the renderer at the canvas element in the HTML
      });
      
      this.renderer.setClearColor(new THREE.Color('lightgrey'), 0)
      this.renderer.setSize( 640, 480 ); //TODO: resize to entire component size
      
      //Setup the THREEAR Source with the parent div and the renderer and camera we setup
      this.source = new THREEAR.Source({parent: this.container, renderer: this.renderer, camera: this.camera});
      
      if(this.debug){
        this.monitor1 = new Info();
        this.monitorContainerRef.nativeElement.appendChild(this.monitor1.getElement());
        this.monitor1.displayPanel(0);
        this.monitor2 = new Info();
        this.monitorContainerRef.nativeElement.appendChild(this.monitor2.getElement());
        this.monitor2.displayPanel(1);
        this.monitor3 = new Info();
        this.monitorContainerRef.nativeElement.appendChild(this.monitor3.getElement());
        this.monitor3.displayPanel(2);
      }

      //Initialize THREEAR
      THREEAR.initialize(
        {
          source: this.source,
          // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
          detectionMode: 'mono_and_matrix',

          // type of matrix code - valid iif detectionMode end with 'matrix' -
          // [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
          matrixCodeType: '3x3',

          //timeout for setting a marker as lost when it is no longer seen
          //default was 1000
          lostTimeout: 100,

          positioning: {
            // turn on/off camera smoothing
            smooth: false, //note: turning this off seems to make the tracking much better

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
          canvasWidth: 640,
          canvasHeight: 480,

          // the patternRatio inside the artoolkit marker - artoolkit only
          patternRatio: 0.5,

          // enable image smoothing or not for canvas copy - default to true
          // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
          imageSmoothingEnabled: true
        }
        ).then((controller: THREEAR.Controller) => {
          //Initalize returns a controller, set this.controller to that so we have a reference to it
          this.controller = controller;

          //Call animate for the first time
          this.animate();

          //Resolve the initAR Promise
          resolve();

        }).catch(error => {
          reject(error);
        });
      }) 
    }
    
    
    /**
     * Animation and AR updating loop
     */
    private animate() {
      //Setup the next call
      if(this.debug) {
        this.monitor1.begin();
        this.monitor2.begin();
        this.monitor3.begin();
      } 
      this.deltaTime = this.clock.getDelta(); //Calculate the time delta between frames
      this.totalTime += this.deltaTime; //Add to the current timestamp
      
      //Update the state of the THREEAR Controller
      this.controller.update( this.source.domElement );
      
      //Render the markers
      this.renderer.render( this.scene, this.camera );
      if(this.debug) {
        this.monitor1.end();
        this.monitor2.end();
        this.monitor3.end();
      }
      requestAnimationFrame(() => {this.animate();});
    }
    
    
    /**
     * Adds a marker to the scene and controller
     * @param barcodeValue the number of the barcode for the marker
     * @param imgPath the path to the image to display for the marker
     */
    public addMarker(marker: ARMarker): THREEAR.BarcodeMarker {
      
      //Setup the three group for this marker
      let markerGroup = new THREE.Group;
      //Add the group to the scene that contains all the markers
      this.scene.add(markerGroup);
      
      //Create the geometry the texture will be placed on
      let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);

      //Create the basic image texture
      let loader = new THREE.TextureLoader();
      let texture = loader.load(marker.imgPath);
      let material1 = new THREE.MeshBasicMaterial( { map: texture } );
      
      //create a mesh of the image texture on the geometry
      let mesh1 = new THREE.Mesh( geometry1, material1 );

      //Rotate the mesh so the image is flat on the marker
      mesh1.rotation.x = -Math.PI/2;
      
      //Add the mesh to the group
      markerGroup.add( mesh1 );
      
      //Create the THREEAR BarcodeMarker object for this marker
      let barcodeMarker = new THREEAR.BarcodeMarker({
        barcodeValue: marker.barcodeValue,
        markerObject: markerGroup,
        size: 1,
        minConfidence: 0.2
      });

      
      
      //Start tracking the marker
      this.controller.trackMarker(barcodeMarker);

      if(this.debug) console.log(barcodeMarker);

      return barcodeMarker;
    }

    /**
     * Sets up marker events
     */
    private setupEvents() {
      this.controller.addEventListener("markerFound", (event) => {
        //if (this.debug) console.log(event.marker);
        this.onMarkerStates.emit(this.controller.markers.barcode.map(barcode => <MarkerState>{barcodeValue: barcode.barcodeValue, found: barcode.found}));
      })
      this.controller.addEventListener("markerLost", (event) => {
        //if (this.debug) console.log(event.marker);
        this.onMarkerStates.emit(this.controller.markers.barcode.map(barcode => <MarkerState>{barcodeValue: barcode.barcodeValue, found: barcode.found}));
      })
    }
    
    /**
     * Updates existing markers or adds new ones based on a list of markers that have changed.
     * @param changedMarkers the markers that have been changed and need to be updated or added
     */
    private updateMarkers(changedMarkers: ARMarker[]) {

      //Loop through changed markers
      for(let changedMarker of changedMarkers) {

        //Get the current marker with the same barcode value as the current changed marker if it exists
        let oldMarker = this.controller.markers.barcode.find((value) =>
        changedMarker.barcodeValue == value.barcodeValue);

        //If there is already a marker for this ID
        if (oldMarker) {
          //Find the existing marker's mesh
          let object = oldMarker.markerObject as THREE.Group;
          let mesh = object.children[0] as THREE.Mesh
          
          //Replace the existing marker's texture with a new one from the changed image path.
          let loader = new THREE.TextureLoader();
          let texture = loader.load(changedMarker.imgPath);
          let material = mesh.material as THREE.MeshBasicMaterial;
          material.map = texture;

        } else {
          //If there is not an existing marker for the ID, add a new one.
          this.addMarker(changedMarker);
        }
      }
    }
 
    ngOnChanges(changes: SimpleChanges) {
      //Check if there is a change to the markers and make sure AR has started
      if(typeof changes['markers'] != "undefined" && this.arReady) {
        let change = changes['markers'];

        //We don't want to do this on the first change because that is when we are already setting the markers
        if(!change.firstChange && change.previousValue) {
          let current = change.currentValue as ARMarker[];
          let previous = change.previousValue as ARMarker[];

          //Get which markers have changed
          let diff = current.filter(m => !previous.includes(m));
          if(this.debug) console.log(diff);

          //Send the markers that have been changed to updateMarkers to be updated or added.
          this.updateMarkers(diff);
        }
      }
      
    }
    
    ngOnDestroy() {
      //TODO: make sure everything is cleaned up properly
    }
    
  }
  