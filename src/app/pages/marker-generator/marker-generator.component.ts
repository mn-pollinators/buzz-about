import { Component, OnInit } from '@angular/core';
import { BarcodeMarkerGenerator, MATRIX_5X5_BCH_2277 } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-marker-generator',
  templateUrl: './marker-generator.component.html',
  styleUrls: ['./marker-generator.component.scss']
})
export class MarkerGeneratorComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer) { }

  test: BarcodeMarkerGenerator;

  barcodeValue = '0';

  getBarcode(value: string) {
    const marker = new BarcodeMarkerGenerator(MATRIX_5X5_BCH_2277, parseInt(value, 10));
    return this.sanitizer.bypassSecurityTrustUrl(marker.asSVGDataURI());
  }

  ngOnInit(): void {
    this.test = new BarcodeMarkerGenerator(MATRIX_5X5_BCH_2277, 1);
    console.log(this.test.asSVG());
    console.log(BarcodeMarkerGenerator.getMatrixTypes());
  }

}
