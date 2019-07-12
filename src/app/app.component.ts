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

  public showContent: boolean = false;

  ngAfterViewInit(): void { //Thanks to HeinPauwelyn @ https://github.com/aframevr/aframe/issues/2518#issuecomment-289450266

    // TODO: This is broken for now until we figure out how to relate the timeout to the assignment

    // for (let i: number = JSON.markers.length; i--;) {

    //     let image: any = JSON.markers[i],
    //         el: any = document.getElementById(image.id);

    //     el.setAttribute("position", image.position);
    //     el.setAttribute("src", image.src);
    //     el.setAttribute("rotation", image.rotation);
    //     el.setAttribute("scale", image.scale);
    // }
  }

  public ngOnInit() {
    setTimeout(()=>this.showContent=true, 1000); 
    //Thanks to Valikhan Akhmedov, Oct 4 '16 at 12:22 @ https://stackoverflow.com/a/39852249/8273171
    //This move was inspired by kawalt's react-aframe-ar-test's index.js @ https://github.com/kalwalt/react-aframe-ar-test/blob/master/src/index.js
    //which was inspired by fega @ https://github.com/jeromeetienne/AR.js/issues/493#issuecomment-490303718
  }
}
// }