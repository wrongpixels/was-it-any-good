//import type { Request, Response } from 'express';
import express, { Router } from 'express';
import { Show } from '../models';
import CustomError from '../util/customError';
import { buildShowEntry } from '../services/show-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { ShowResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';

const router: Router = express.Router();
router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const showEntry: Show | null = await Show.scope([
      'withSeasons',
      'withCredits',
    ]).findByPk(id);
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
router.get('/tmdb/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    let showEntry: Show | null = await Show.scope([
      'withSeasons',
      'withCredits',
    ]).findOne({
      where: {
        tmdbId: id,
      },
    });
    if (!showEntry) {
      const transaction: Transaction = await sequelize.transaction();
      try {
        showEntry = await buildShowEntry(id, transaction);
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
