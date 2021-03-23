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
  asset_urls: {
    art_500_wide: string;
    art_512_square: string;
    art_512_square_grayscale: string;
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
    ],
    asset_urls: {
      art_500_wide: `/assets/art/500w/flowers/${flowerFromJson.art_file}`,
      art_512_square: `/assets/art/512-square/flowers/${flowerFromJson.art_file}`,
      art_512_square_grayscale: `/assets/art/512-square-grayscale/flowers/${flowerFromJson.art_file}`
    }
  };
}

export const allFlowerSpecies =
  allFlowersConverted as {[id in keyof typeof allFlowersFromJson]: FlowerSpecies};
