export interface Bee {
  id: string;
  species: string;
  imgSrc: string;
  active: boolean;
  live: boolean;
  currentFlower: string;
  buzzingPeriods: {from: string, to: string}[];
  health: number;
  visible: boolean;
}
