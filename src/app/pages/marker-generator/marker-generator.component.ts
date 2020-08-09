import { Component, OnInit } from '@angular/core';
import { BarcodeMarkerGenerator, MATRIX_5X5_BCH_2277 } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CustomBarcodeMarkerGenerator } from 'src/app/CustomBarcodeMarkerGenerator';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

const fonts = {
  // Temporary: download default Roboto font from cdnjs.com
  // TODO replace this with either Google's font CDN or move the Google fonts into this project's assets
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
};

@Component({
  selector: 'app-marker-generator',
  templateUrl: './marker-generator.component.html',
  styleUrls: ['./marker-generator.component.scss']
})
export class MarkerGeneratorComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer) { }

  test: BarcodeMarkerGenerator;

  barcodeValue = '0';

  getBarcodeSVGDataURI(value: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.getBarcode(value).asSVGDataURIWithSize(200));
  }

  getBarcode(value: string) {
    return new CustomBarcodeMarkerGenerator(MATRIX_5X5_BCH_2277, parseInt(value, 10));
  }

  ngOnInit(): void {
    this.test = new BarcodeMarkerGenerator(MATRIX_5X5_BCH_2277, 1);
    console.log(this.test.asSVG());
    console.log(BarcodeMarkerGenerator.getMatrixTypes());
  }

  makePdf() {
    const docDefinition: TDocumentDefinitions = {
      content: [
        `Buzz About Marker ${this.barcodeValue}`,
        {
          svg: this.getBarcode(this.barcodeValue).asSVGWithSize(400),
        }
      ]
    };
    pdfMake.createPdf(docDefinition, null, fonts).open();
  }

}
