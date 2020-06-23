import { flowers as flowersFromJson } from '@mn-pollinators/assets/flowers.json';
import { TimePeriod } from './time-period';

export interface Flower{
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
  blooming_period: [TimePeriod, TimePeriod][];
  description: string;
}

const flowersConverted: {[id: string]: Flower} = {};

for (const [key, flowerFromJson] of Object.entries(flowersFromJson)) {
  flowersConverted[key] = {
    ...flowerFromJson,
    id: key,
    blooming_period: flowerFromJson.blooming_period.map(interval =>
      [
        TimePeriod.fromIsoDate(interval.split('/')[0]),
        TimePeriod.fromIsoDate(interval.split('/')[1]),
      ]
    )
  };
}

const flowers = flowersConverted as {[id in keyof typeof flowersFromJson]: Flower};

export { flowers };
