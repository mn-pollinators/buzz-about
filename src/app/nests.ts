import { nests as nestsFromJson } from '@mn-pollinators/assets/nests.json';

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

const nestsConverted: {[id: string]: Nest} = {};

for (const [key, nestFromJson] of Object.entries(nestsFromJson)) {
  nestsConverted[key] = {
    ...nestFromJson,
    id: key,
  };
}

export const nests =
  nestsConverted as {[id in keyof typeof nestsFromJson]: Nest};
