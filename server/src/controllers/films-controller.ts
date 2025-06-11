//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import { Film } from '../models';
import { buildFilmEntry } from '../services/film-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { FilmResponse } from '../../../shared/types/models';
const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: Film | null = await Film.scope('withCredits').findByPk(id);
    if (!filmEntry) {
      throw new CustomError('Could not Film entry', 400);
    }
    const film: FilmResponse = filmEntry.get({ plain: true });
    res.json(film);
  } catch (error) {
    next(error);
  }
});

router.get('/tmdb/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    let filmEntry: Film | null = await Film.scope('withCredits').findOne({
      where: { tmdbId: id.toString() },
    });

    if (!filmEntry) {
      const transaction: Transaction = await sequelize.transaction();
      try {
        filmEntry = await buildFilmEntry(id, transaction);
        await transaction.commit();
      } catch (error) {
        console.log('Rolling back');
        await transaction.rollback();
        throw error;
      }
    }
    if (!filmEntry) {
      throw new CustomError('Could not find or create entry', 400);
    }
    const film: FilmResponse = filmEntry.get({ plain: true });
    res.json(film);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (_req, res, next) => {
  try {
    const newEntry = null;
    if (!newEntry) {
      throw new CustomError('Data format is not valid', 400);
    }
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});
export default router;
