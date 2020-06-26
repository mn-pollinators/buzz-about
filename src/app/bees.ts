import { bees as allBeesFromJson } from '@mn-pollinators/assets/bees.json';
import { TimePeriod } from './time-period';
import { FlowerSpecies, allFlowerSpecies } from './flowers';
import { Nest, allNests } from './nests';

export interface BeeSpecies {
  id: string;
  name: string;
  sci_name: string;
  relative_size: number;
  flowers_accepted: FlowerSpecies[];
  art_file: string;
  photo_files: {
    filename: string;
    attribution: string;
    caption: string;
    image_link: string;
  }[];
  active_period: [TimePeriod, TimePeriod][];
  description: {
    genus?: string;
    sociality?: string;
    nesting?: string;
    pollen_collection?: string;
    activity?: string;
    species?: string;
    brood?: string;
    forage?: string;
    features?: string;
    did_you_know?: string;
    chosen_bee?: string;
  };
  nest_type: Nest;
  sociality: BeeSociality;
}

export enum BeeSociality {
  social,
  solitary,
  primitively_social,
  eusocial,
  communal,
}

const allBeesConverted: {[id: string]: BeeSpecies} = {};

for (const [key, beeFromJson] of Object.entries(allBeesFromJson)) {
  allBeesConverted[key] = {
    ...beeFromJson,
    id: key,
    flowers_accepted: beeFromJson.flowers_accepted
      // Ignore unknown flower names
      .filter(flowerId => flowerId in allFlowerSpecies)
      .map(flowerId => allFlowerSpecies[flowerId]),
    nest_type: allNests[beeFromJson.nest_type],
    active_period: beeFromJson.active_period.map(interval =>
      [
        TimePeriod.fromIsoDate(interval.split('/')[0]),
        TimePeriod.fromIsoDate(interval.split('/')[1]),
      ]
    ),
    sociality: BeeSociality[beeFromJson.sociality],
  };
}

export const allBeeSpecies =
  allBeesConverted as {[id in keyof typeof allBeesFromJson]: BeeSpecies};
