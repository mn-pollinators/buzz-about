import { Component, OnInit } from '@angular/core';
import { Round, Marker } from '../rounds/round';
import { ExampleRound } from "../rounds/example.round";
import { MarkerState } from '../ar-view/ar-view.component';

@Component({
  selector: 'app-play-round',
  templateUrl: './play-round.component.html',
  styleUrls: ['./play-round.component.scss']
})
export class PlayRoundComponent implements OnInit {

  round: Round;

  roundReady: boolean;

  constructor() { }

  testMarkers : Marker[] = [
    {name:"sunflower", barcodeValue:1, imgPath:"assets/images/1000w-8bit/flowers/sunflower.png"},
    {name:"black raspberry", barcodeValue:2, imgPath:"assets/images/1000w-8bit/flowers/black raspberry.png"},
    {name:"rudbeckia hirta", barcodeValue:3, imgPath:"assets/images/1000w-8bit/flowers/rudbeckia hirta.png"},
    {name:"solidago rigida", barcodeValue:4, imgPath:"assets/images/1000w-8bit/flowers/solidago rigida.png"}
  ]

  ngOnInit() {
    this.round = new ExampleRound("Test Round", this.testMarkers);

    this.roundReady = true;
  }

  onMarkerState(states: MarkerState[]) {
    //console.log(states);
    this.round.onMarkerState(states);
  }

  testMarkerChange() {

    //this is creating a new reference to the array so Angular change detection will notice
    let newmarkers = [].concat(this.round.markers); 
    
    newmarkers.push({name:"test marker", barcodeValue:5, imgPath:"assets/icons/icon-512x512.png"});
    newmarkers[1] = {name:"test marker 1", barcodeValue:2, imgPath:"assets/icons/icon-512x512.png"};
    this.round.markers = newmarkers; 
  }



}
