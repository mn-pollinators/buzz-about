import { allBeeSpecies, allBeeSpeciesArray } from '../bees';
import { allFlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { RoundTemplateSet } from './round-templates';

export const testEditableRounds: RoundTemplateSet = {
  id: 'test-editable-rounds',
  name: 'Test Editable Rounds',
  templates: [
    {
      id: 'test-edit-round-1',
      name: 'Editable Round 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      editBeforeStart: true,
      flowerSpecies: [
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        null,
      ],
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 10000,
      bees: [
        ...allBeeSpeciesArray
      ]
    },
    {
      id: 'test-edit-round-2',
      name: 'Editable Round 2',
      editBeforeStart: true,
      flowerSpecies: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 10000,
      bees: [
        ...allBeeSpeciesArray
      ]
    },
  ],
};
