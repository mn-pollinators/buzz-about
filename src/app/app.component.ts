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
      
      for (let i: number = JSON.markers.length; i--;) { //Thanks to HeinPauwelyn @ https://github.com/aframevr/aframe/issues/2518#issuecomment-289450266
        let image: any = JSON.markers[i],
        el: any = document.getElementById(image.id); 
        el.setAttribute("position", image.position); 
        el.setAttribute("src", image.src);
        el.setAttribute("rotation", image.rotation);
        el.setAttribute("scale", image.scale);
      }
    });
  }

   
  private loadScripts() {
    this.dynamicScriptLoader.load('aframe','arjs').then(data => {
      this.showContent=true;
    }).catch(error => console.log(error));
  }
}
