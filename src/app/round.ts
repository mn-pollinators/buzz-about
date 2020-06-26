import { FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';


/**
 * The round data as stored in Firebase.
 */
export interface FirebaseRound {
  flowerSpeciesIds: string[];
  status: string;
  running: boolean;
  currentTime: number;
}

/**
 * An individual flower in the round that bees can visit.
 *
 * Instances of RoundFlower are immutable. As such, when a flower
 * blooms or stops blooming, a new instance of RoundFlower is created.
 */
export class RoundFlower {
  readonly isBlooming: boolean;

  constructor(public readonly species: FlowerSpecies, currentTime: TimePeriod) {
    this.isBlooming = species.blooming_period.some(interval => currentTime.fallsWithin(...interval));
  }
}
