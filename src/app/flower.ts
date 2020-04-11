export interface Flower {
  id: string;
  species: string;
  scientificName?: string;
  imgSrc?: string;
  imgSrc_inactive?: string;
  blooming?: boolean;
  activePeriods?: {from: string, to: string}[];
  visible?: boolean;
  occupied?: boolean;
}
