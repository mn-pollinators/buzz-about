import { Component } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import JSON from 'src/assets/roundtest.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ar-simulation';

  ngAfterViewInit(): void { //Thanks to HeinPauwelyn @ https://github.com/aframevr/aframe/issues/2518#issuecomment-289450266

    for (let i: number = JSON.markers.length; i--;) {

        let image: any = JSON.markers[i],
            el: any = document.getElementById(image.id);

        el.setAttribute("position", image.position);
        el.setAttribute("src", image.src);
        el.setAttribute("rotation", image.rotation);
        el.setAttribute("scale", image.scale);
    }
  }
}
