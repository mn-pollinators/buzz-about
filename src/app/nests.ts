import { nests as nestsFromJson } from '@mn-pollinators/assets/nests.json';

export interface Nest {
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

// Make sure that the values are actually Nests.
export const nests: {[id in keyof typeof nestsFromJson]: Nest} = nestsFromJson;
