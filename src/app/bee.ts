export interface Bee {
  id: string;
  species: string;
  scientificName?: string;
  imgSrc?: string;
  imgSrc_inactive?: string;
  active?: boolean;
  live?: boolean;
  currentFlower?: string;
  activePeriods?: {from: string, to: string}[];
  health?: number;
  visible?: boolean;
}
