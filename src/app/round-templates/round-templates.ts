import { FlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { BeeSpecies } from '../bees';
import { set1 } from './set-1';
import { testRounds } from './test-rounds';

export interface TemplateBee {
  species: BeeSpecies;
  weight: number;
}

export interface RoundTemplate {
  // `id` should a globally unique identifier.
  id: string;
  // `name` should be a human-readable identifier.
  name: string;
  description?: string;
  flowerSpecies: FlowerSpecies[];
  startTime: TimePeriod;
  endTime: TimePeriod;
  tickSpeed: number;
  bees?: TemplateBee[];
}

export interface RoundTemplateSet {
  // `id` should a globally unique identifier.
  id: string;
  // `name` should be a human-readable identifier.
  name: string;
  description?: string;
  templates: RoundTemplate[];
}

export const defaultRoundSets: RoundTemplateSet[] = [
  set1
];
