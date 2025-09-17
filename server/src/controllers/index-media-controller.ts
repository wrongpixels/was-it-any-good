import express, { NextFunction, Request, Response } from 'express';

import { MediaType } from '../../../shared/types/media';
import { gatherMedia } from '../services/index-media-service';
import { IndexMediaData } from '../../../shared/types/models';
import { IndexMedia } from '../models';
import CustomError, { NotFoundError } from '../util/customError';
import idFormatChecker from '../middleware/id-format-checker';

const router = express.Router();

router.get('/:id', idFormatChecker, async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    if (Number.isNaN(id)) {
      throw new CustomError('Wrong id format', 400);
    }
    const entry: IndexMediaData | null = await IndexMedia.findByPk(id, {
      include: {
        association: 'film',
      },
      raw: true,
    });
    if (!entry) {
      throw new NotFoundError();
    }
    res.json(entry);
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

export default router;
