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
  active_period: [TimePeriod, TimePeriod];
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
  asset_urls: {
    art_500_wide: string;
  };
}

export enum BeeSociality {
  social,
  solitary,
  primitively_social,
  eusocial,
  communal,
}

/**
 * A map from the keys in a `BeeSpecies` description to nicely formatted strings for display.
 */
export const beeDescriptionKeys: {[key in (keyof BeeSpecies['description'])]: string} = {
  genus: 'Genus',
  sociality: 'Sociality',
  nesting: 'Nesting',
  pollen_collection: 'Pollen collection',
  activity: 'Activity',
  species: 'Species',
  brood: 'Brood',
  forage: 'Foraging behavior',
  features: 'Features',
  did_you_know: 'Did you know?',
  chosen_bee: 'Chosen Bee',
};

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
    active_period: [
      TimePeriod.fromIsoDate(beeFromJson.active_period.split('/')[0]),
      TimePeriod.fromIsoDate(beeFromJson.active_period.split('/')[1]),
    ],
    sociality: BeeSociality[beeFromJson.sociality],
    asset_urls: {
      art_500_wide: `/assets/art/500w/bees/${beeFromJson.art_file}`
    }
  };
}

export const allBeeSpecies =
  allBeesConverted as {[id in keyof typeof allBeesFromJson]: BeeSpecies};

/**
 * Finds the bees attracted to a given flower.
 * @param flower The `FlowerSpecies` to find bees for.
 * @returns An array of the `BeeSpecies` which list the given flower in their `flowers_accepted`.
 */
export function getBeesForFlower(flower: FlowerSpecies): BeeSpecies[] {
  return Object.values(allBeeSpecies).filter(bee => bee.flowers_accepted.includes(flower));
}
