import { ThoughtBubbleType } from './components/thought-bubble/thought-bubble.component';

/**
 * A barcode marker for AR.
 *
 * It's like a little tiny QR code.
 *
 * When you point your webcam at the barcode marker, the AR View superimposes
 * an image on top.
 */
export interface ARMarker {
  barcodeValue: number;
  imgPath: string;
}

export function markersEqual(a: ARMarker, b: ARMarker) {
  return a.barcodeValue === b.barcodeValue && a.imgPath === b.imgPath;
}

/**
 * This interface is like `ARMarker`, but it carries semantics about the
 * simulation.
 *
 * (`ARMarker`s are kind of just QR codes; they don't know anything about bees
 * and flowers. This interface is more of a gameplay object; what its name is,
 * whether you can visit it, and stuff like that.)
 */
export interface RoundMarker extends ARMarker {
  name: string;

  // The `isBlooming` field will only be present if this round marker
  // represents a flower. (Not a nest.)
  isBlooming?: boolean;

  isNest: boolean;

  canVisit: boolean;

  // The 'tip' field will only be present if this round marker matches any conditional
  // to display a tip to the students
  tip?: string;

  // This field will only be present on round markers representing flowers.
  // It will be true or false depending on whether this flower species is
  // on a bee's 'flowers_accepted' list
  incompatibleFlower?: boolean;

  thoughtBubble?: ThoughtBubbleType;
}

export const MIN_FLOWER_MARKER = 1;
export const MAX_FLOWER_MARKER = 16;

// The range of marker numbers used for nests (inclusive).
export const MIN_NEST_MARKER = 20;
export const MAX_NEST_MARKER = 120;

export const MAX_CURRENT_POLLEN = 3;
