import express, { NextFunction, Request, Response } from 'express';

import { MediaType } from '../../../shared/types/media';
import {
  gatherMedia,
  TMDBIndexToIndexMedia,
} from '../services/index-media-service';
import { CreateIndexMedia, IndexMediaData } from '../../../shared/types/models';
import { IndexMedia } from '../models';
import CustomError from '../util/customError';

const router = express.Router();

router.get('/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    if (Number.isNaN(id)) {
      throw new CustomError('Wrong id format', 400);
    }
    const entry: IndexMedia | null = await IndexMedia.findByPk(id, {
      include: {
        association: 'film',
      },
    });
    if (!entry) {
      res.json(null);
      return;
    }
    const indexMedia: IndexMediaData = entry.get({ plain: true });

    res.json(indexMedia);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (_req, res, next) => {
  try {
    const indexMedia: CreateIndexMedia[] = TMDBIndexToIndexMedia();
    const entries: IndexMedia[] = await IndexMedia.bulkCreate(indexMedia, {
      updateOnDuplicate: ['popularity', 'baseRating', 'mediaType'],
    });
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
