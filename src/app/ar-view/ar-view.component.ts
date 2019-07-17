import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as THREEAR from 'threear';

export interface ARMarker {
  barcodeValue: number;
  imgPath: string;
}

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
  @Output() markerStates = new EventEmitter<MarkerState[]>();
  
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
  
  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.initAR().then(() => { //init ar

      this.arReady = true;

      //loop through markers provided to the component
      for(var marker of this.markers) {
        //add each marker
        this.addMarker(marker.barcodeValue,marker.imgPath);

        this.setupEvents();
      }
      //do initial marker setup, probably also set a ready flag
    });
  }


  /**
   * Setup the canvas, camera, and basic AR library
   * @returns a promise that resolves when AR is ready.
   */
  initAR() : Promise<any> {
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
          imageSmoothingEnabled: false
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
    animate() {
      //Setup the next call
      requestAnimationFrame(() => {this.animate();});

      this.deltaTime = this.clock.getDelta(); //Calculate the time delta between frames
      this.totalTime += this.deltaTime; //Add to the current timestamp
      
      //Update the state of the THREEAR Controller
      this.controller.update( this.source.domElement );
      
      //Render the markers
      this.renderer.render( this.scene, this.camera );
    }
    
    
    /**
     * Adds a marker to the scene and controller
     * @param barcodeValue the number of the barcode for the marker
     * @param imgPath the path to the image to display for the marker
     */
    addMarker(barcodeValue: number, imgPath: string) {
      
      //Setup the three group for this marker
      let markerGroup = new THREE.Group;
      //Add the group to the scene that contains all the markers
      this.scene.add(markerGroup);
      
      //Create the geometry the texture will be placed on
      let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);

      //Create the basic image texture
      let loader = new THREE.TextureLoader();
      let texture = loader.load(imgPath);
      let material1 = new THREE.MeshBasicMaterial( { map: texture } );
      
      //create a mesh of the image texture on the geometry
      let mesh1 = new THREE.Mesh( geometry1, material1 );

      //Rotate the mesh so the image is flat on the marker
      mesh1.rotation.x = -Math.PI/2;
      
      //Add the mesh to the group
      markerGroup.add( mesh1 );
      
      //Create the THREEAR BarcodeMarker object for this marker
      let barcodeMarker = new THREEAR.BarcodeMarker({
        barcodeValue: barcodeValue,
        markerObject: markerGroup,
        size: 1,
        minConfidence: 0.2
      });
      
      //Start tracking the marker
      this.controller.trackMarker(barcodeMarker);
    }

    setupEvents() {
      this.controller.addEventListener("markerFound", (event) => {
        //if (this.debug) console.log(event.marker);
        this.markerStates.emit(this.controller.markers.barcode.map(barcode => <MarkerState>{barcodeValue: barcode.barcodeValue, found: barcode.found}));
      })
      this.controller.addEventListener("markerLost", (event) => {
        //if (this.debug) console.log(event.marker);
        this.markerStates.emit(this.controller.markers.barcode.map(barcode => <MarkerState>{barcodeValue: barcode.barcodeValue, found: barcode.found}));
      })
    }
    

    testAddMarker() {
      this.addMarker(1, "assets/icons/icon-512x512.png");
      this.addMarker(2, "assets/icons/icon-512x512.png");
      this.addMarker(3, "assets/icons/icon-512x512.png");
    }
    
    testButton() {
      let test = this.controller.markers;
      console.log(test);
    }
    
    
    ngOnChanges() {
      
      
    }
    
    ngOnDestroy() {
      //TODO: make sure everything is cleaned up properly
    }
    
  }
  