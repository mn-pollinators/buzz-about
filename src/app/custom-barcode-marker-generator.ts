import { BarcodeMarkerGenerator } from 'studio-backend/src/modules/marker/tools/barcode-marker-generator';

// Code adapted from https://github.com/AR-js-org/studio-backend/blob/master/src/modules/marker/tools/barcode-marker-generator.js

export class CustomBarcodeMarkerGenerator extends BarcodeMarkerGenerator {
  asSVGWithSize(size: number) {
    let svgStr =
      '<?xml version="1.0" encoding="utf-8"?>' +
      `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect x="0" y="0" width="${size}" height="${size}" fill="black" />`;

    const pixelSize = (size / 2) / this.typeDesc.matrixSize;
    for (let y = 0; y < this.typeDesc.matrixSize; ++y) {
      for (let x = 0; x < this.typeDesc.matrixSize; ++x) {
        if (!this.valueEncoded[y * this.typeDesc.matrixSize + x]) {
          svgStr += `<rect x="${(size / 4) + x * pixelSize}" y="${(size / 4) +
            y *
            pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="white" />`;
        }
      }
    }

    svgStr += '</svg>';
    return svgStr;
  }
}
