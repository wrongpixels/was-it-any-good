import express, { NextFunction, Response } from 'express';

import { MediaType } from '../../../shared/types/media';
import {
  gatherMedia,
  TMDBIndexToIndexMedia,
} from '../services/index-media-service';
import { CreateIndexMedia } from '../../../shared/types/models';
import { IndexMedia } from '../models';

const router = express.Router();

router.post('/', async (_req, res, next) => {
  try {
    const indexMedia: CreateIndexMedia[] = TMDBIndexToIndexMedia();
    const entries: IndexMedia[] = await IndexMedia.bulkCreate(indexMedia);
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

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
    const indexMedia: CreateIndexMedia[] = TMDBIndexToIndexMedia();
    res.json(indexMedia);
  } catch (error) {
    next(error);
  }
});

export default router;
