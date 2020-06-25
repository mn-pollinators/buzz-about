import { FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';

export interface Round {
  flowerSpeciesIds: string[];
  status: string;
  running: boolean;
  currentTime: number;
}


export class RoundFlower {
  readonly isBlooming: boolean;

  constructor(public readonly species: FlowerSpecies, currentTime: TimePeriod) {
    this.isBlooming = species.blooming_period.some(interval => currentTime.fallsWithin(...interval));
  }
}
