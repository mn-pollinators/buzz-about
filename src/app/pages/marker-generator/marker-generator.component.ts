import { Component, OnInit } from '@angular/core';
import { MATRIX_4X4_BCH_1393 } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Content, PageOrientation, PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CustomBarcodeMarkerGenerator } from '../../custom-barcode-marker-generator';
import { rangeArray } from 'src/app/utils/array-utils';
import { MAX_FLOWER_MARKER, MAX_NEST_MARKER, MIN_FLOWER_MARKER, MIN_NEST_MARKER } from 'src/app/markers';
import { buzzAbout as buzzAboutInfo } from '../../../../project-info.json';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const fonts = {
  Roboto: {
    // yep, it doesn't understand relative paths
    normal: `${window.location.origin}/assets/fonts/Roboto/Roboto-Regular.ttf`,
  }
};

// This SVG is so small I don't think its worth making the HTTP request to get it
// tslint:disable-next-line: max-line-length
const beeSVG = '<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 30 30"><path fill-rule="nonzero" d="M13.506,4L12.416,4C12.226,3.46 11.926,2.95 11.486,2.51C11.046,2.07 10.546,1.78 10.006,1.59L10.006,0.5C10.006,0.22 9.786,0 9.506,0C9.226,0 9.006,0.22 9.006,0.5L9.006,1.38C8.896,1.37 8.776,1.35 8.666,1.35C7.646,1.35 6.616,1.74 5.836,2.52C5.676,2.68 5.536,2.86 5.406,3.05L4.006,2.52C2.446,1.97 0.726,2.79 0.176,4.34C-0.094,5.09 -0.054,5.91 0.296,6.63C0.526,7.11 0.876,7.5 1.296,7.79C0.916,9.14 1.236,10.64 2.296,11.7C3.356,12.76 4.866,13.08 6.206,12.7C6.496,13.12 6.886,13.47 7.366,13.7C7.786,13.9 8.216,14 8.656,14C8.996,14 9.336,13.94 9.666,13.83C11.226,13.28 12.046,11.56 11.486,9.98L10.966,8.61C11.146,8.48 11.326,8.34 11.496,8.18C12.366,7.31 12.736,6.14 12.636,5.01L13.516,5.01C13.796,5.01 14.016,4.79 14.016,4.51C14.006,4.22 13.786,4 13.506,4ZM2.676,6.29C2.426,6.2 2.226,6.02 2.106,5.78C1.986,5.54 1.976,5.27 2.066,5.02C2.256,4.5 2.826,4.23 3.326,4.41L6.486,5.6C5.336,6.2 3.856,6.71 2.676,6.29ZM8.996,11.94C8.746,12.03 8.476,12.02 8.236,11.9C7.996,11.79 7.816,11.58 7.726,11.33C7.306,10.15 7.816,8.68 8.426,7.53L9.606,10.66C9.786,11.18 9.516,11.76 8.996,11.94ZM10.206,6.6L9.596,4.99C9.596,4.98 9.586,4.97 9.576,4.96L9.516,4.84C9.496,4.8 9.476,4.77 9.446,4.73L9.266,4.55C9.236,4.52 9.196,4.5 9.156,4.48C9.116,4.46 9.086,4.43 9.036,4.42C9.026,4.42 9.016,4.41 9.006,4.4L7.406,3.8C7.766,3.51 8.196,3.34 8.666,3.34C9.196,3.34 9.706,3.55 10.076,3.93C10.806,4.66 10.846,5.81 10.206,6.6Z" transform="matrix(2.14038,0,0,2.14038,0.000394013,0)"/></svg>';

const MARKERS_VERSION = '4';

const BARCODE_TYPE = MATRIX_4X4_BCH_1393;

interface Page {
  value: string;
  type: string;
  backgroundSVG: string;
}

@Component({
  selector: 'app-marker-generator',
  templateUrl: './marker-generator.component.html',
  styleUrls: ['./marker-generator.component.scss']
})
export class MarkerGeneratorComponent implements OnInit {

  maxNumNests = MAX_NEST_MARKER - MIN_NEST_MARKER + 1;

  markerFormGroup = new FormGroup({
    pageSizeControl: new FormControl('LETTER', Validators.required),
    pageOrientationControl: new FormControl('portrait', Validators.required),
    includeFlowersControl: new FormControl(true, Validators.required),
    includeNestsControl: new FormControl(true, Validators.required),
    numNestsControl: new FormControl(30, [
      Validators.required,
      Validators.min(1),
      Validators.max(this.maxNumNests)
    ]),
  },
  {
    validators: (fg: FormGroup) => {
      return (
        fg.controls.includeFlowersControl.value
        || fg.controls.includeNestsControl.value
        ) ? null : {'no-flowers-or-nests' : true};
    }
  });

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {

  }


  getBarcode(value: number) {
    return new CustomBarcodeMarkerGenerator(BARCODE_TYPE, value);
  }

  flowerPages(markerSize: number) {
    return rangeArray(MIN_FLOWER_MARKER, MAX_FLOWER_MARKER).map(val =>
      ({
        value: `${val}`,
        type: 'Flower',
        backgroundSVG: this.getBarcode(val).asSVGWithSize(markerSize)
      }));
  }

  nestPages(nestCount: number, markerSize: number) {
    if (nestCount === 0) {
      return [];
    }
    return rangeArray(MIN_NEST_MARKER, MIN_NEST_MARKER + nestCount - 1).map(val =>
      ({
        value: `${val}`,
        type: 'Nest',
        backgroundSVG: this.getBarcode(val).asSVGWithSize(markerSize)
      }));
  }

  pdfFromPages(
    pages: Page[],
    svgHeight: number,
    pageSize: PageSize = 'LETTER',
    pageOrientation: PageOrientation = 'portrait'
  ): pdfMake.TCreatedPdf {
    const content: Content[] = pages.map((p, i, arr) => ({
      columns: [
        {
          // nesting columns here to allow the outer column to have width '*'
          // while allowing the SVG to have a valid width.
          columns: [
            {
              svg: beeSVG,
              height: 40,
              width: 40,
              relativePosition: {x: 0, y: 0}
            }
          ],
          width: '*'
        },
        {
          width: 'auto',
          stack: [
            p.type,
            {
              text: p.value,
              fontSize: 24
            }
          ],
          alignment: 'center'
        },
        {
          width: '*',
          text: `Buzz About Markers v${MARKERS_VERSION}`,
          alignment: 'right'
        }
      ],
      columnGap: 10,
      pageBreak: arr.length - 1 === i ? null : 'after'
    }));

    const docDefinition: TDocumentDefinitions = {
      pageSize,
      pageOrientation,
      content,
      background: (currentPage, currentPageSize) => {
        return {
          svg: pages[currentPage - 1].backgroundSVG,
          alignment: 'center',
          height: svgHeight,
          margin: [0, (currentPageSize.height - svgHeight) / 2, 0, 0]
        };
      },
      info: {
        title: `Buzz About Markers v${MARKERS_VERSION}`,
        author: 'Minnesota Pollinators',
        creator: `Buzz About ${buzzAboutInfo.version} (${buzzAboutInfo.git.hash})`
      }
    };

    return pdfMake.createPdf(docDefinition, null, fonts);
  }

  makePdf(): pdfMake.TCreatedPdf {

    const pageSize: PageSize = this.markerFormGroup.controls.pageSizeControl.value;
    const orientation: PageOrientation = this.markerFormGroup.controls.pageOrientationControl.value;
    const includeFlowers: boolean = this.markerFormGroup.controls.includeFlowersControl.value;
    const includeNests: boolean = this.markerFormGroup.controls.includeNestsControl.value;
    const numNests: number = this.markerFormGroup.controls.numNestsControl.value;

    const markerSize = 200;

    return this.pdfFromPages(
      [
        ...(includeFlowers ? this.flowerPages(markerSize) : []),
        ...(includeNests ? this.nestPages(numNests, markerSize) : [])
      ], markerSize, pageSize, orientation);
  }

  openPDF() {
    this.makePdf().open();
  }

  downloadPDF() {
    this.makePdf().download(`Buzz About Markers v${MARKERS_VERSION}`);
  }

  printPDF() {
    this.makePdf().print();
  }

}
