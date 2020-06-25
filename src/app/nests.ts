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
}

const allNestsConverted: {[id: string]: Nest} = {};

for (const [key, nestFromJson] of Object.entries(allNestsFromJson)) {
  allNestsConverted[key] = {
    ...nestFromJson,
    id: key,
  };
}

export const allNests =
  allNestsConverted as {[id in keyof typeof allNestsFromJson]: Nest};
