import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  markers = [
    {id:"1", barcodeValue:1, imgPath:"assets/icons/icon-512x512.png"},
    {id:"2", barcodeValue:2, imgPath:"assets/icons/icon-512x512.png"},
    {id:"3", barcodeValue:3, imgPath:"assets/icons/icon-512x512.png"},
    {id:"4", barcodeValue:4, imgPath:"assets/icons/icon-512x512.png"}
  ]
}
