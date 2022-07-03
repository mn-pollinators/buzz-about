import { FlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { BeeSpecies } from '../bees';
import { set1 } from './set-1';
import { testRounds } from './test-rounds';

/**
 * A round template is used to create the round when started.
 * It specifies things such as the flowers and bees in the round
 * as well as the start and end time and tick speed.
 */
export interface RoundTemplate {
  /**
   * The unique ID for this round template
   */
  id: string;
  /**
   * The human-readable name for the round template, shown when selecting the round
   */
  name: string;
  /**
   * The human-readable description of the round template, shown when selecting the round
   */
  description?: string;
  /**
   * The list of flower species for the round.
   * This can be either 8 or 16 flower species.
   */
  flowerSpecies: FlowerSpecies[];
  /**
   * The start TimePeriod for the round
   */
  startTime: TimePeriod;
  /**
   * The end TimePeriod for the round
   */
  endTime: TimePeriod;
  /**
   * The speed at which a single 'tick' of time occurs during a round in milliseconds.
   */
  tickSpeed: number;
  /**
   * An (optional) array of bee species to be assigned to students when the round is created.
   * To have the bees occur at different rates, create the array in a way that represents the desired weights.
   * If no array is given, bees will be assigned from the set of all be species.
   */
  bees?: BeeSpecies[];
  /**
   * Should the round be edited before starting
   */
  editBeforeStart?: boolean;
}

/**
 * A set of round templates to be shown in the round selector
 */
export interface RoundTemplateSet {
  /**
   * The unique ID for this round template set
   */
  id: string;
  /**
   * The human-readable name for the round template set, shown when selecting the set
   */
  name: string;
  /**
   * The human-readable description of the round template set, shown when selecting the set
   */
  description?: string;
  /**
   * The RoundTemplates in the set
   */
  templates: RoundTemplate[];
}

export const defaultRoundSets: RoundTemplateSet[] = [
  set1,
  testRounds
];
