import { nests as allNestsFromJson } from '@mn-pollinators/assets/nests.json';

export interface Nest {
  id: string;
  name: string;
  art_file: string;
  photo_files: {
    filename: string;
    attribution: string;
    caption: string;
    image_link: string;
  }[];
  description: string;
  asset_urls: {
    art_500_wide: string;
    art_512_square: string;
    art_512_square_grayscale: string;
  };
}

const allNestsConverted: {[id: string]: Nest} = {};

for (const [key, nestFromJson] of Object.entries(allNestsFromJson)) {
  allNestsConverted[key] = {
    ...nestFromJson,
    id: key,
    asset_urls: {
      art_500_wide: `/assets/art/500w/nests/${nestFromJson.art_file}`,
      art_512_square: `/assets/art/512-square/nests/${nestFromJson.art_file}`,
      art_512_square_grayscale: `/assets/art/512-square-grayscale/nests/${nestFromJson.art_file}`
    }
  };
}

export const allNests =
  allNestsConverted as {[id in keyof typeof allNestsFromJson]: Nest};

export const allNestsArray: Nest[] = [
  ...Object.values(allNests)
];
