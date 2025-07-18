//import type { Request, Response } from 'express';
import express, { Request, Router } from 'express';
import { Show } from '../models';
import CustomError from '../util/customError';
import { buildShowEntry } from '../services/show-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { ShowResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';
import { MediaQueryValues } from '../types/media/media-types';
import { MediaType } from '../../../shared/types/media';

const router: Router = express.Router();

router.get('', async (_req, res, next) => {
  try {
    const showEntries: Show[] = await Show.findAll({ order: [['id', 'ASC']] });
    if (!showEntries) {
      res.json(null);
      return;
    }
    const showResponses: ShowResponse[] = Array.from(showEntries.values());
    res.json(showResponses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    const showEntry = await Show.findBy({
      mediaId: id,
      activeUser: req.activeUser,
    });
    if (!showEntry) {
      res.json(null);
      return;
    }
    const show: ShowResponse = showEntry.get({ plain: true });
    res.json(show);
  } catch (error) {
    next(error);
  }
});
router.get('/tmdb/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    const mediaValues: MediaQueryValues = {
      activeUser: req.activeUser,
      mediaId: id,
      mediaType: MediaType.Show,
      isTmdbId: true,
    };
    let showEntry = await Show.findBy(mediaValues);
    if (!showEntry) {
      const transaction: Transaction = await sequelize.transaction();
      try {
        showEntry = await buildShowEntry({ ...mediaValues, transaction });
        await transaction.commit();
      } catch (error) {
        //we always rollback if something fails
        await transaction.rollback();
        console.log('Rolling back');
        if (error instanceof AxiosError && error.status === 404) {
          //if it's a 404 Axios error, it means the logic run fine but the show doesn't exist in TMDB.
          res.json(null);
          return;
        }
        throw error;
      }
    } else {
      console.log('Found show first try');
    }
    if (!showEntry) {
      res.json(null);
      return;
    }
    const show: ShowResponse = showEntry.get({ plain: true });
    res.json(show);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newEntry = await Show.create(req.body);
    if (!newEntry) {
      throw new CustomError('Data format is not valid', 400);
    }
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});
export default router;
