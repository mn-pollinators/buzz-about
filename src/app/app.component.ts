import { Component, OnInit } from '@angular/core';
import JSON from 'src/assets/roundtest.json';
import { DynamicScriptLoaderService } from 'src/app/DynamicScriptLoaderService'  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ar-simulation';

  JSON: any;
  public showContent: boolean = false;
  
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}

  ngOnInit() {
    this.loadScripts();

    window.addEventListener('load', (event) => {  //Thanks to this article: https://www.kirupa.com/html5/running_your_code_at_the_right_time.htm
      
      for (let i: number = JSON.markers.length; i--;) {
        let image: any = JSON.markers[i];
        this.addMarker(image.id,image.src);
      }
    });
  }

   
  private loadScripts() {
    this.dynamicScriptLoader.load('aframe').then(data => {
      this.dynamicScriptLoader.load('arjs').then(data => {
        this.showContent=true;
    }).catch(error => console.log(error));
  }).catch(error => console.log(error));
}

  private addMarker(value: string, imageSrc: string) {
      
    var sceneEl = document.querySelector('a-scene');

    var newMarker = document.createElement('a-marker');
    newMarker.setAttribute('id',value);
    newMarker.setAttribute('type','barcode');
    newMarker.setAttribute('value',value);
    sceneEl.appendChild(newMarker);

    var markerEl = document.getElementById(value);
    var newImage = document.createElement('a-image');
    newImage.setAttribute('position','0 0 0');
    newImage.setAttribute('src',imageSrc);
    newImage.setAttribute('rotation','-90 0 0');
    newImage.setAttribute('scale','1 1 1');
    markerEl.appendChild(newImage);
  }
}
