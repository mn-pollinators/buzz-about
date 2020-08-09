import { Component, OnInit } from '@angular/core';
import { BarcodeMarkerGenerator, MATRIX_5X5_BCH_2277 } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';

@Component({
  selector: 'app-marker-generator',
  templateUrl: './marker-generator.component.html',
  styleUrls: ['./marker-generator.component.scss']
})
export class MarkerGeneratorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const test = new BarcodeMarkerGenerator(MATRIX_5X5_BCH_2277, 1);
    console.log(test.asSVG());
    console.log(BarcodeMarkerGenerator.getMatrixTypes());
  }

}
