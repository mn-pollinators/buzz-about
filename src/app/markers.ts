import { RoundFlower, Interaction } from './round';

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
}

export const MIN_FLOWER_MARKER = 1;
export const MAX_FLOWER_MARKER = 16;

// The range of marker numbers used for nests (inclusive).
export const MIN_NEST_MARKER = 20;
export const MAX_NEST_MARKER = 120;


/**
 * Given a RoundFlower instance and some supplemental information, construct
 * a RoundMarker.
 */
export function roundMarkerFromRoundFlower(
  flower: RoundFlower,
  barcodeValue: number,
  currentBeePollen: number,
  recentFlowerInteractions: Interaction[]
): RoundMarker {
  const canVisit = canVisitFlower(
    barcodeValue,
    flower.isBlooming,
    currentBeePollen,
    recentFlowerInteractions,
  );
  return {
    barcodeValue,
    imgPath: imagePathForFlower(flower),
    name: flower.species.name,
    isBlooming: flower.isBlooming,
    isNest: false,
    canVisit,
  };
}

export const MAX_CURRENT_POLLEN = 3;

/**
 * Given some information about a flower, return whether the bee can
 * interact with it right now.
 *
 * (The bee may be unable to interact with it if, for example, the bee is
 * carrying too much pollen already.)
 */
export function canVisitFlower(
  barcodeValue: number,
  isBlooming: boolean,
  currentBeePollen: number,
  recentFlowerInteractions: Interaction[],
): boolean {
  const haveVisitedThisFlower = recentFlowerInteractions
    .map(interaction => interaction.barcodeValue)
    .includes(barcodeValue);
  return isBlooming && currentBeePollen < MAX_CURRENT_POLLEN && !haveVisitedThisFlower;
}

function imagePathForFlower(flower: RoundFlower): string {
  return (
    `/assets/art/${flower.isBlooming ? '512-square' : '512-square-grayscale'}`
    + `/flowers/${flower.species.art_file}`
  );
}
