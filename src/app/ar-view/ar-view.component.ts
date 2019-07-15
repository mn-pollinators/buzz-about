import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as THREEAR from 'threear';

//declare var THREE: any;
//declare var THREEx: any;


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
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  deltaTime: number;
  totalTime: number;
  //markerGroup: THREE.Group;
  source: THREEAR.Source;
  
  controller: THREEAR.Controller;
  
  
  //arToolkitSource: any; //from ar.js
  //arToolkitContext: any; //from ar.js
  
  markerControls: any[];
  
  constructor() {
    
    this.markerControls = [];
    
  }
  
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas', {static: true}) 
  private canvasRef: ElementRef;

  private get container(): HTMLCanvasElement {
    return this.containerRef.nativeElement;
  }
  
  @ViewChild('container', {static: true}) 
  private containerRef: ElementRef;
  
  initAR() {

    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

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
    
    
    
    this.source = new THREEAR.Source({parent: this.container, renderer: this.renderer, camera: this.camera});
    
    THREEAR.initialize(
      {
        source: this.source,
        detectionMode: 'mono_and_matrix',
        matrixCodeType: '3x3'
      }
      ).then((controller: THREEAR.Controller) => {
        this.controller = controller;
        this.animate();
      })
      
    }
    
    setupAREvents() {
      window.addEventListener('markerFound', () => {
        console.log('markerFound');
      })
    }
    
    onResize() {
      console.log("onResize called");
    }
    
    animate() {
      requestAnimationFrame(() => {this.animate();});
      this.deltaTime = this.clock.getDelta();
      this.totalTime += this.deltaTime;

      this.controller.update( this.source.domElement );
          
      this.renderer.render( this.scene, this.camera );
    }

    
    ngOnInit() {
    }
  
    ngAfterViewInit() {
      this.initAR();
      this.setupAREvents();
    }
    
    
    addMarker(barcodeID: number, imgPath: string) {

      let markerGroup = new THREE.Group;
      this.scene.add(markerGroup);

      let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);
      let loader = new THREE.TextureLoader();
      let texture = loader.load(imgPath);
      let material1 = new THREE.MeshBasicMaterial( { map: texture } );
      
      let mesh1 = new THREE.Mesh( geometry1, material1 );
      mesh1.rotation.x = -Math.PI/2;
      
      markerGroup.add( mesh1 );

      let barcodeMarker = new THREEAR.BarcodeMarker({
        barcodeValue: barcodeID,
        markerObject: markerGroup,
        minConfidence: 0.2
      });
      
      this.controller.trackMarker(barcodeMarker);
    }
    
    testAddMarker() {
      this.addMarker(1, "assets/icons/icon-512x512.png");
      this.addMarker(2, "assets/icons/icon-512x512.png");
      this.addMarker(3, "assets/icons/icon-512x512.png");
    }
    
    
    ngOnChanges() {
      
      
    }
    
    ngOnDestroy() {
      
      
    }
    
  }
  