import { Component, OnInit } from '@angular/core';
import { MATRIX_4X4_BCH_1393 } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CustomBarcodeMarkerGenerator } from '../../custom-barcode-marker-generator';
import { rangeArray } from 'src/app/utils/array-utils';
import { MAX_FLOWER_MARKER, MIN_FLOWER_MARKER, MIN_NEST_MARKER } from 'src/app/markers';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

const BARCODE_TYPE = MATRIX_4X4_BCH_1393;

interface Page {
  content: Content;
  backgroundSVG: string;
}

@Component({
  selector: 'app-marker-generator',
  templateUrl: './marker-generator.component.html',
  styleUrls: ['./marker-generator.component.scss']
})
export class MarkerGeneratorComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {

  }

  getBarcode(value: number) {
    return new CustomBarcodeMarkerGenerator(BARCODE_TYPE, value);
  }

  flowerPages(markerSize: number) {
    return rangeArray(MIN_FLOWER_MARKER, MAX_FLOWER_MARKER).map(val =>
      ({
        content: `Flower ${val}`,
        backgroundSVG: this.getBarcode(val).asSVGWithSize(markerSize)
      }));
  }

  nestPages(nestCount: number, markerSize: number) {
    return rangeArray(MIN_NEST_MARKER, MIN_NEST_MARKER + nestCount).map(val =>
      ({
        content: `Nest ${val}`,
        backgroundSVG: this.getBarcode(val).asSVGWithSize(markerSize)
      }));
  }

  pdfFromPages(pages: Page[], svgHeight: number): pdfMake.TCreatedPdf {
    const content: Content[] = pages.map((p, i, arr) => ({
      text: p.content,
      pageBreak: arr.length - 1 === i ? null : 'after'
    }));

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      content,
      background: (currentPage, pageSize) => {
        return {
          svg: pages[currentPage - 1].backgroundSVG,
          alignment: 'center',
          height: svgHeight,
          margin: [0, (pageSize.height - svgHeight) / 2, 0, 0]
        };
      }
    };
    return pdfMake.createPdf(docDefinition, null, fonts);
  }

  makePdf(): pdfMake.TCreatedPdf {

    const markerSize = 200;
    const numNests = 100;

    return this.pdfFromPages([...this.flowerPages(markerSize), ...this.nestPages(numNests, markerSize)], markerSize);
  }

}
