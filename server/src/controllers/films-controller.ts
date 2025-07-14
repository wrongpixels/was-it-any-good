//import type { Request, Response } from 'express';
import express, { Router } from 'express';
import CustomError from '../util/customError';
import { Film } from '../models';
import { buildFilmEntry } from '../services/film-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { FilmResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';
const router: Router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const filmEntires: Film[] = await Film.findAll({});
    if (!filmEntires) {
      res.json(null);
      return;
    }
    const filmResponses: FilmResponse[] = Array.from(filmEntires.values());
    res.json(filmResponses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: Film | null = await Film.scope('withCredits').findByPk(id);
    if (!filmEntry) {
      res.json(null);
      return;
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
        //we always rollback if something fails
        await transaction.rollback();
        console.log('Rolling back');
        if (error instanceof AxiosError && error.status === 404) {
          //if it's a 404 Axios error, it means the logic run fine but the film doesn't exist in TMDB.
          res.json(null);
          return;
        }
        throw error;
      }
    }
    if (!filmEntry) {
      res.json(null);
      return;
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
