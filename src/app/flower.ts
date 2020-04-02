export interface Flower {
  id: string;
  species: string;
  imgSrc?: string;
  blooming?: boolean;
  openPeriods?: {from: string, to: string}[];
  visible?: boolean;
  occupied?: boolean;
}
