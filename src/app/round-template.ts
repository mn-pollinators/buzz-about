import { FlowerSpecies, allFlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';
import { BeeSpecies, allBeeSpecies } from './bees';

export interface RoundTemplate {
  name: string;
  flowerSpecies: FlowerSpecies[];
  startTime: TimePeriod;
  endTime: TimePeriod;
  tickSpeed: number;
  bees?: {
    species: BeeSpecies;
    weight: number;
  }[];
}

export const roundTemplates: RoundTemplate[] = [
  {
    name: 'Viable Ecosystem',
    flowerSpecies: [
      allFlowerSpecies.asclepias_syriaca,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.echinacea_angustifolia,
      allFlowerSpecies.rubus_occidentalis,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.prunus_americana,
      allFlowerSpecies.rudbeckia_hirta,
      allFlowerSpecies.solidago_rigida,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.trifolium_repens,
      allFlowerSpecies.vaccinium_angustifolium,
      allFlowerSpecies.helianthus_maximiliani,
      allFlowerSpecies.rubus_occidentalis,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.rudbeckia_hirta,
      allFlowerSpecies.taraxacum_officinale
    ],
    startTime: TimePeriod.fromMonthAndQuarter(4, 1),
    endTime: TimePeriod.fromMonthAndQuarter(11, 4),
    tickSpeed: 1000,
    bees: [
      { species: allBeeSpecies.agapostemon_virescens, weight: 0.2 },
      { species: allBeeSpecies.augochloropsis_metallica, weight: 0.2 },
      { species: allBeeSpecies.megachile_pugnata, weight: 0.2 },
      { species: allBeeSpecies.anthidium_manicatum, weight: 0.2 },
      { species: allBeeSpecies.bombus_affinis, weight: 0.2 }
    ]
  },
  {
    name: 'Non-viable Ecosystem',
    flowerSpecies: [
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.cirsium_discolor
    ],
    startTime: TimePeriod.fromMonthAndQuarter(4, 1),
    endTime: TimePeriod.fromMonthAndQuarter(11, 4),
    tickSpeed: 1000,
    bees: [
      { species: allBeeSpecies.apis_mellifera, weight: 0.2 },
      { species: allBeeSpecies.colletes_simulans, weight: 0.2 },
      { species: allBeeSpecies.megachile_pugnata, weight: 0.2 },
      { species: allBeeSpecies.hylaeus_modestus, weight: 0.2 },
      { species: allBeeSpecies.bombus_affinis, weight: 0.2 }
    ]
  },
  {
    name: 'Demo Round',
    flowerSpecies: [
      allFlowerSpecies.asclepias_syriaca,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.echinacea_angustifolia,
      allFlowerSpecies.helianthus_maximiliani,
      allFlowerSpecies.monarda_fistulosa,
      allFlowerSpecies.prunus_americana,
      allFlowerSpecies.rubus_occidentalis,
      allFlowerSpecies.rudbeckia_hirta,
      allFlowerSpecies.solidago_rigida,
      allFlowerSpecies.taraxacum_officinale,
      allFlowerSpecies.trifolium_repens,
      allFlowerSpecies.vaccinium_angustifolium,
      allFlowerSpecies.asclepias_syriaca,
      allFlowerSpecies.cirsium_discolor,
      allFlowerSpecies.echinacea_angustifolia,
      allFlowerSpecies.helianthus_maximiliani,
    ],
    startTime: TimePeriod.fromMonthAndQuarter(4, 1),
    endTime: TimePeriod.fromMonthAndQuarter(11, 4),
    tickSpeed: 5000
  },




];
