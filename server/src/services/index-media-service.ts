import path from 'path';
import fs from 'fs/promises';
import { MediaType } from '../../../shared/types/media';
import { CreateIndexMedia } from '../../../shared/types/models';
import IndexMedia from '../models/media/indexMedia';
import { tmdbAPI } from '../util/config';
import { createIndexForMediaBulk } from '../factories/media-factory';
import {
  TMDBIndexFilm,
  TMDBIndexFilmArraySchema,
  TMDBIndexShow,
  TMDBIndexShowArraySchema,
} from '../schemas/tmdb-index-media-schemas';
import jsonFilms from '../db/popular-films-db.json';
import jsonShows from '../db/popular-shows-db.json';

const PAGES_TO_GATHER: number = 10;
const DB_PATH: string = path.join(__dirname, '../db');

export const TMDBIndexToIndexMedia = (): CreateIndexMedia[] => {
  const testFilm: TMDBIndexFilm[] = TMDBIndexFilmArraySchema.parse(jsonFilms);
  const testShow: TMDBIndexShow[] = TMDBIndexShowArraySchema.parse(jsonShows);

  const uniquieIndexMedia = new Map<string, CreateIndexMedia>();

  createIndexForMediaBulk(testFilm, testShow).forEach(
    (im: CreateIndexMedia) => {
      const key = `${im.tmdbId}-${im.mediaType}`;
      uniquieIndexMedia.set(key, im);
    }
  );
  return Array.from(uniquieIndexMedia.values());
};

export const gatherMedia = async (mediaType: MediaType): Promise<number> => {
  const media: unknown[] = [];

  for (let page = 1; page <= PAGES_TO_GATHER; page++) {
    const response = await tmdbAPI.get(
      `/discover/${mediaType === MediaType.Film ? 'movie' : 'tv'}`,
      {
        params: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page,
          sort_by: 'popularity.desc',
        },
      }
    );
    media.push(...response.data.results);
  }

  await fs.mkdir(DB_PATH, { recursive: true });
  await fs.writeFile(
    path.join(
      DB_PATH,
      `popular-${mediaType === MediaType.Film ? 'films' : 'shows'}-db.json`
    ),
    JSON.stringify(media, null, 2)
  );
  return media.length;
};

export const addIndexMedia = async (
  data: CreateIndexMedia
): Promise<IndexMedia | null> => {
  const [indexEntry]: [IndexMedia, boolean | null] =
    await IndexMedia.upsert(data);
  return indexEntry;
};
