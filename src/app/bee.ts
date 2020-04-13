import { GameMonth } from 'src/app/month';

export interface Bee {
  id: string;
  species: string;
  scientificName?: string;
  imgSrc?: string;
  imgSrc_inactive?: string;
  active?: boolean;
  live?: boolean;
  currentFlower?: string;
  activePeriods?: {from: GameMonth, to: GameMonth}[];
  health?: number;
  visible?: boolean;
}
