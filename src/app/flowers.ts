import { flowers as allFlowersFromJson } from '@mn-pollinators/assets/flowers.json';
import { TimePeriod } from './time-period';

export interface FlowerSpecies {
  id: string;
  name: string;
  sci_name: string;
  relative_size: number;
  art_file: string;
  photo_files: {
    filename: string;
    attribution: string;
    caption: string;
    image_link: string;
  }[];
  blooming_period: [TimePeriod, TimePeriod];
  description: {
    summary: string;
    bees_attracted?: string;
  };
}

const allFlowersConverted: {[id: string]: FlowerSpecies} = {};

for (const [key, flowerFromJson] of Object.entries(allFlowersFromJson)) {
  allFlowersConverted[key] = {
    ...flowerFromJson,
    id: key,
    blooming_period: [
      TimePeriod.fromIsoDate(flowerFromJson.blooming_period.split('/')[0]),
      TimePeriod.fromIsoDate(flowerFromJson.blooming_period.split('/')[1]),
    ]
  };
}

export const allFlowerSpecies =
  allFlowersConverted as {[id in keyof typeof allFlowersFromJson]: FlowerSpecies};
