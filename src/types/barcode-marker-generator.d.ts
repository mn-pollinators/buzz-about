// Referencing https://github.com/AR-js-org/studio-backend/blob/master/src/modules/marker/tools/barcode-marker-generator.js

declare module 'studio-backend/src/modules/marker/tools/barcode-marker-generator' {
  export const MATRIX_3X3_HAMMING_63 : string;
  export const MATRIX_3X3_PARITY_65 : string;
  export const MATRIX_4X4_BCH_1355 : string;
  export const MATRIX_4X4_BCH_1393 : string;
  export const MATRIX_5X5_BCH_2277 : string;
  export const MATRIX_5X5_BCH_22125 : string;

  export class BarcodeMarkerGenerator {
    constructor (matrixTypeId: string, value: number);
    static getMatrixTypes(): BarcodeMatrixType[];
    asSVG(): string;
    asSVGDataURI(): string;
  }

  export interface BarcodeMatrixType {
    id: string;
    maxNumMarkers: number;
    hamming: number;
    matrixSize: number;
    encoder: (n: number) => boolean[];
  }
}
