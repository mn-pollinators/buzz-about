import { allBeeSpecies } from '../bees';
import { allFlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { RoundTemplateSet } from './round-templates';

const commonAttributes = {
  startTime: TimePeriod.fromMonthAndQuarter(4, 1),
  endTime: TimePeriod.fromMonthAndQuarter(11, 4),
  // This round takes about 8 minutes to run.
  // (13 seconds per tick * 36 ticks)
  tickSpeed: 13000,
  bees: [
    { species: allBeeSpecies.agapostemon_virescens, weight: 0.2 },
    { species: allBeeSpecies.anthophora_bomboides, weight: 0.2 },
    { species: allBeeSpecies.augochlora_pura, weight: 0.2 },
    { species: allBeeSpecies.bombus_affinis, weight: 0.2 },
    { species: allBeeSpecies.xylocopa_virginica, weight: 0.2 },
  ],
};

export const set1: RoundTemplateSet = {
  id: 'set-1',
  name: 'Exploring Biodiversity',
  description: 'These rounds demonstrate how bees are affected when there\'s more or less biodiversity of flowers (8 flower markers).',
  templates: [
    {
      id: 'set-1-monoculture',
      name: 'Three Flower Species',
      description: 'In this first round, we\'ve only planted a few different species of flowers.',
      flowerSpecies: [
        allFlowerSpecies.rudbeckia_hirta,
        allFlowerSpecies.trifolium_repens,
        allFlowerSpecies.trifolium_repens,
        allFlowerSpecies.rudbeckia_hirta,
        allFlowerSpecies.trifolium_repens,
        allFlowerSpecies.monarda_fistulosa,
        allFlowerSpecies.rudbeckia_hirta,
        allFlowerSpecies.trifolium_repens,
      ],
      ...commonAttributes
    },
    {
      id: 'set-1-semi-monoculture',
      name: 'Four Flower Species',
      description: 'Next, we\'ve added milkweed flowers to the prairie, so that there are four species of flowers.',
      flowerSpecies: [
        allFlowerSpecies.asclepias_syriaca,
        allFlowerSpecies.trifolium_repens,
        allFlowerSpecies.monarda_fistulosa,
        allFlowerSpecies.monarda_fistulosa,
        allFlowerSpecies.asclepias_syriaca,
        allFlowerSpecies.monarda_fistulosa,
        allFlowerSpecies.rudbeckia_hirta,
        allFlowerSpecies.asclepias_syriaca,
      ],
      ...commonAttributes
    },
    {
      id: 'set-1-polyculture',
      name: 'Eight Flower Species',
      description: 'Finally, we\'ve planted many different species of flowers.',
      flowerSpecies: [
        allFlowerSpecies.asclepias_syriaca,
        allFlowerSpecies.rubus_occidentalis,
        allFlowerSpecies.echinacea_angustifolia,
        allFlowerSpecies.monarda_fistulosa,
        allFlowerSpecies.rudbeckia_hirta,
        allFlowerSpecies.solidago_rigida,
        allFlowerSpecies.trifolium_repens,
        allFlowerSpecies.zizia_aurea,
      ],
      ...commonAttributes
    },
  ],
};
