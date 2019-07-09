import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ArService } from '../ar.service';
import * as THREE from 'three';

//declare var THREE: any;
declare var THREEx: any;

interface  ArMarkerControlsParamaters {
  // size of the marker in meter
  size? : number,
  // type of marker - ['pattern', 'barcode', 'unknown' ]
  type? : 'pattern' | 'barcode' | 'unknown',
  // url of the pattern - IIF type='pattern'
  patternUrl? : string,
  // value of the barcode - IIF type='barcode'
  barcodeValue? : string,
  // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
  changeMatrixMode? : 'modelViewMatrix' | 'cameraTransformMatrix',
  // minimal confidence in the marke recognition - between [0, 1] - default to 1
  minConfidence?: number,
  // turn on/off camera smoothing
  smooth?: boolean,
  // number of matrices to smooth tracking over, more = smoother but slower follow
  smoothCount?: number,
  // distance tolerance for smoothing, if smoothThreshold # of matrices are under tolerance, tracking will stay still
  smoothTolerance?: number,
  // threshold for smoothing, will keep still unless enough matrices are over tolerance
  smoothThreshold?: number,
}

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.scss']
})
export class ArViewComponent implements OnInit {

  @Input() markers: {id: string, barcodeValue: string, img: string}[];
  @Output() markerFound = new EventEmitter<boolean>();

  //https://github.com/stemkoski/AR-Examples/blob/master/texture.html

  //var scene, camera, renderer, clock, deltaTime, totalTime;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  clock: THREE.Clock;
  deltaTime: number;
  totalTime: number;

  arToolkitSource: any; //from ar.js
  arToolkitContext: any; //from ar.js

  markerControls: any[];

  constructor() {

    this.markerControls = [];

   }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas', {static: true}) 
  private canvasRef: ElementRef;

  initAR() {
    this.scene = new THREE.Scene();
    let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
    this.scene.add( ambientLight );
          
    this.camera = new THREE.Camera();
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      antialias : true,
      alpha: true,
      canvas: this.canvas
    });

    //this.renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    this.renderer.setSize( 640, 480 ); //TODO: resize to entire component size
    //this.renderer.domElement.style.position = 'absolute'
    //this.renderer.domElement.style.top = '0px'
    //this.renderer.domElement.style.left = '0px'
    //document.body.appendChild( this.renderer.domElement );
    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType : 'webcam',
    });

    this.arToolkitSource.init();

    // handle resize event
    window.addEventListener('resize', () => {
      this.onResize();
    });

    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'assets/camera_para.dat',
      // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
      detectionMode: 'mono_and_matrix',
      // type of matrix code - valid iif detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
      matrixCodeType: '3x3',
      // tune the maximum rate of pose detection in the source image
      maxDetectionRate: 60,
      // resolution of at which we detect pose in the source image
      canvasWidth: 640,
      canvasHeight: 480,

      // the patternRatio inside the artoolkit marker - artoolkit only
      patternRatio: 0.5,
    });
    
    // copy projection matrix to camera when initialization complete
    this.arToolkitContext.init( () => {
      this.camera.projectionMatrix.copy( this.arToolkitContext.getProjectionMatrix() );
      console.log('artoolkitcontext init');
      console.log(this.arToolkitContext);
    });

  }

  setupAREvents() {
    window.addEventListener('markerFound', () => {
      console.log('markerFound');
    })
  }

  onResize() {
    console.log("onResize called");
  }

  update() {
    if ( this.arToolkitSource.ready !== false ) {
        this.arToolkitContext.update( this.arToolkitSource.domElement );
    }
		  
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

  animate() {
    requestAnimationFrame(() => {this.animate()});
    this.deltaTime = this.clock.getDelta();
    this.totalTime += this.deltaTime;
    this.update();
    this.render();
  }

  ngOnInit() {
    this.initAR();
    this.setupAREvents();
    this.animate();
  }


  addMarkerRoot(ArMarkerControlsparamaters : ArMarkerControlsParamaters, imgPath: string) {
    let markerRoot1 = new THREE.Group();
    this.scene.add(markerRoot1);
    let markerControls1 = new THREEx.ArMarkerControls(this.arToolkitContext, markerRoot1, ArMarkerControlsparamaters)
    this.markerControls.push(markerControls1);
    let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);
    let loader = new THREE.TextureLoader();
    let texture = loader.load(imgPath);
    let material1 = new THREE.MeshBasicMaterial( { map: texture } );
    
    let mesh1 = new THREE.Mesh( geometry1, material1 );
    mesh1.rotation.x = -Math.PI/2;
    
    markerRoot1.add( mesh1 );
    console.log(markerRoot1);
    console.log(this.scene);
    
  }

  testAddMarker() {
    this.addMarkerRoot({type: 'barcode', barcodeValue: "1"}, "assets/icons/icon-512x512.png");
    this.addMarkerRoot({type: 'barcode', barcodeValue: "2"}, "assets/icons/icon-512x512.png");
    this.addMarkerRoot({type: 'barcode', barcodeValue: "3"}, "assets/icons/icon-512x512.png");
  }


  ngOnChanges() {


  }

  ngOnDestroy() {


  }

}
