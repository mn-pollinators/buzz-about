import { GameMonth } from 'src/app/month';

export interface Flower {
  id: string;
  species: string;
  scientificName?: string;
  imgSrc?: string;
  active?: boolean;
  activePeriods?: {from: GameMonth, to: GameMonth}[];
  occupied?: boolean;
}
