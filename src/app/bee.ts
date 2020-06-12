import { GameMonth } from 'src/app/time-period';
import { Flower } from './flower';
import { Nest } from './nest';

export interface Bee {
  id: string;
  species: string;  // The name of the bee
  scientificName?: string;  // The sci name is used in the review item
  customName?: string;      // may be used in reviewing particular visiting paths
  imgSrc?: string;  // The image should has an appropriate size depending where it is displayed
  active?: boolean;
  live?: boolean;
  currentFlower?: string;
  activePeriods?: {from: GameMonth, to: GameMonth}[]; // The active periods is at the precision of a quarter of a month
  path?: {type: 'Flower' | 'Nest', approach: Flower | Nest}[];  // May be used to review the visiting path of a particular bee
  health?: number;
}
