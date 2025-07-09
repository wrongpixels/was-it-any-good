import express, { NextFunction, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import jsonFilms from '../db/popular-films-db.json';
import jsonShows from '../db/popular-shows-db.json';

import { tmdbAPI } from '../util/config';
import { MediaType } from '../../../shared/types/media';
import {
  TMDBIndexFilm,
  TMDBIndexFilmSchema,
  TMDBIndexShow,
  TMDBIndexShowSchema,
} from '../schemas/tmdb-index-media-schemas';

const router = express.Router();
const PAGES_TO_GATHER: number = 10;
const DB_PATH: string = path.join(__dirname, '../db');
const gatherMedia = async (mediaType: MediaType): Promise<number> => {
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

router.post('/populate', async (_req, res: Response, next: NextFunction) => {
  try {
    const films: number = await gatherMedia(MediaType.Film);
    const shows: number = await gatherMedia(MediaType.Show);
    res.json({ shows, films });
  } catch (error) {
    next(error);
  }
});

router.post('/parse', async (_req, res: Response, next: NextFunction) => {
  try {
    const testFilm: TMDBIndexFilm = TMDBIndexFilmSchema.parse(jsonFilms[0]);
    const testShow: TMDBIndexShow = TMDBIndexShowSchema.parse(jsonShows[0]);

    res.json({ testFilm, testShow });
  } catch (error) {
    next(error);
  }
});

export default router;
