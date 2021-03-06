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
      tickSpeed: 99999,
      bees: [
        allBeeSpecies.bombus_affinis,
        allBeeSpecies.apis_mellifera
      ]
    },
  ],
};
