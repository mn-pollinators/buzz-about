import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ar-simulation';

  collapseBar: boolean = false;

  markers = [
    {id:"1", barcodeValue:1, imgPath:"assets/icons/icon-512x512.png"},
    {id:"2", barcodeValue:2, imgPath:"assets/icons/icon-512x512.png"},
    {id:"3", barcodeValue:3, imgPath:"assets/icons/icon-512x512.png"},
    {id:"4", barcodeValue:4, imgPath:"assets/icons/icon-512x512.png"}
  ]

}
