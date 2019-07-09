import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArService } from '../ar.service';
import * as THREE from 'three';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.scss']
})
export class ArViewComponent implements OnInit {

  @Input() markers: {id: string, img: string}[];
  @Output() markerFound = new EventEmitter<boolean>();

  //https://github.com/stemkoski/AR-Examples/blob/master/texture.html

  //var scene, camera, renderer, clock, deltaTime, totalTime;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  clock: THREE.Clock;
  deltaTime: number;
  totalTime: number;

  //arToolkitSource: ArToolkitSource;


  constructor(arService : ArService) {


   }

  initAR() {
    this.scene = new THREE.Scene();
    let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
    this.scene.add( ambientLight );
          
    this.camera = new THREE.Camera();
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      antialias : true,
      alpha: true
    });

    //this.renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    this.renderer.setSize( 640, 480 );
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.top = '0px'
    this.renderer.domElement.style.left = '0px'
    document.body.appendChild( this.renderer.domElement );
    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

    //arToolkitSource = new THREEx.ArToolkitSource({
    //  sourceType : 'webcam',
    //});
  }

  ngOnInit() {
    this.initAR();
  }

  ngOnChanges() {


  }

  ngOnDestroy() {


  }

}
