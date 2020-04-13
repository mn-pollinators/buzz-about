import { GameMonth } from 'src/app/month';

export interface Flower {
  id: string;
  species: string;
  scientificName?: string;
  imgSrc?: string;
  imgSrc_inactive?: string;
  blooming?: boolean;
  activePeriods?: {from: GameMonth, to: GameMonth}[];
  visible?: boolean;
  occupied?: boolean;
}
