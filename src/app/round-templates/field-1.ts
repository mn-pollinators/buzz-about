import { allBeeSpecies } from '../bees';
import { allFlowerSpecies } from '../flowers';
import { TimePeriod } from '../time-period';
import { RoundTemplateSet } from './round-template';

export const field1: RoundTemplateSet = {
  name: 'Field #1',
  templates: [
    {
      name: 'Three Flower Species',
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
    },
    {
      name: 'Four Flower Species',
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
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 13000,
      bees: [
        { species: allBeeSpecies.agapostemon_virescens, weight: 0.2 },
        { species: allBeeSpecies.anthophora_bomboides, weight: 0.2 },
        { species: allBeeSpecies.augochlora_pura, weight: 0.2 },
        { species: allBeeSpecies.bombus_affinis, weight: 0.2 },
        { species: allBeeSpecies.xylocopa_virginica, weight: 0.2 },
      ],
    },
    {
      name: 'Eight Flower Species',
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
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 13000,
      bees: [
        { species: allBeeSpecies.agapostemon_virescens, weight: 0.2 },
        { species: allBeeSpecies.anthophora_bomboides, weight: 0.2 },
        { species: allBeeSpecies.augochlora_pura, weight: 0.2 },
        { species: allBeeSpecies.bombus_affinis, weight: 0.2 },
        { species: allBeeSpecies.xylocopa_virginica, weight: 0.2 },
      ],
    },
  ],
};
