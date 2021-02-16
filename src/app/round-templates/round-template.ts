import { FlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { BeeSpecies } from '../bees';
import { field1 } from './field-1';

export interface TemplateBee {
  species: BeeSpecies;
  weight: number;
}

export interface RoundTemplate {
  name: string;
  flowerSpecies: FlowerSpecies[];
  startTime: TimePeriod;
  endTime: TimePeriod;
  tickSpeed: number;
  bees?: TemplateBee[];
}

export interface RoundTemplateSet {
  name: string;
  templates: RoundTemplate[];
}

export const defaultSets: RoundTemplateSet[] = [
  field1,
];
