import { allBeeSpecies } from '../bees';
import { allFlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { RoundTemplateSet } from './round-templates';

export const testRounds: RoundTemplateSet = {
  id: 'test-rounds',
  name: 'Test Rounds',
  templates: [
    {
      id: 'test-long-round',
      name: 'Long Round',
      flowerSpecies: [
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale
      ],
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 1000000,
      bees: [
        { species: allBeeSpecies.bombus_affinis, weight: 1 / 2 },
        { species: allBeeSpecies.apis_mellifera, weight: 1 / 2 }
      ]
    },
  ],
};
