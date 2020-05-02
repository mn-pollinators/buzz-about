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
  path?: {type: 'Flower' | 'Nest', id: string, name?: string, imgSrc?: string}[];
  health?: number;
  visible?: boolean;
}
