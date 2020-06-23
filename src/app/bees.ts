import { bees as beesFromJson } from '@mn-pollinators/assets/bees.json';
import { TimePeriod } from './time-period';
import { Flower, flowers } from './flowers';
import { Nest, nests } from './nests';

export interface Bee {
  id: string;
  name: string;
  sci_name: string;
  relative_size: number;
  flowers_accepted: Flower[];
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

const beesConverted: {[id: string]: Bee} = {};

for (const [key, beeFromJson] of Object.entries(beesFromJson)) {
  beesConverted[key] = {
    ...beeFromJson,
    id: key,
    flowers_accepted: beeFromJson.flowers_accepted
      // Ignore unknown flower names
      .filter(id => flowers[id] !== undefined)
      .map(id => flowers[id]),
    nest_type: nests[beeFromJson.nest_type],
    active_period: beeFromJson.active_period.map(interval =>
      [
        TimePeriod.fromIsoDate(interval.split('/')[0]),
        TimePeriod.fromIsoDate(interval.split('/')[1]),
      ]
    ),
    sociality: BeeSociality[beeFromJson.sociality],
  };
}

const bees = beesConverted as {[id in keyof typeof beesFromJson]: Bee};

export { bees };
