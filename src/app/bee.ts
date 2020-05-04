import { GameMonth } from 'src/app/month';
import { Flower } from './flower';
import { Nest } from './nest';

export interface Bee {
  id: string;
  species: string;
  scientificName?: string;
  customName?: string;
  imgSrc?: string;
  imgSrc_inactive?: string;
  active?: boolean;
  live?: boolean;
  currentFlower?: string;
  activePeriods?: {from: GameMonth, to: GameMonth}[];
  path?: {type: 'Flower' | 'Nest', approach: Flower | Nest}[];
  health?: number;
  visible?: boolean;
}
