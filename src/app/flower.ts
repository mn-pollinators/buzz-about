import { GameMonth } from 'src/app/time-period';

export interface Flower {
  id: string;
  species: string;  // The name of the flower
  scientificName?: string; // The sci name is used in the review item
  imgSrc?: string;  // The image should has an appropriate size depending where it is displayed
  active?: boolean; // The image of the flower is greyed out within the large display when false
  activePeriods?: {from: GameMonth, to: GameMonth}[]; // The active periods is at the precision of a quarter of a month
  occupied?: boolean;
}
