//import type { Request, Response } from 'express';
import express, { Request, Router } from 'express';
import CustomError from '../util/customError';
import { Film } from '../models';
import { buildFilmEntry } from '../services/film-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { FilmResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';
import { MediaQueryValues } from '../types/media/media-types';
import { MediaType } from '../../../shared/types/media';
const router: Router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const filmEntires: FilmResponse[] = await Film.findAll({ raw: true });
    if (!filmEntires) {
      res.json(null);
      return;
    }
    res.json(filmEntires);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: FilmResponse | null = await Film.findBy({
      mediaId: id,
      activeUser: req.activeUser,
      raw: true,
    });

    if (!filmEntry) {
      res.json(null);
      return;
    }
    res.json(filmEntry);
  } catch (error) {
    next(error);
  }
});

router.get('/tmdb/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    const mediaValues: MediaQueryValues = {
      mediaId: id,
      mediaType: MediaType.Film,
      activeUser: req.activeUser,
      isTmdbId: true,
      raw: true,
    };
    let filmEntry: Film | null = await Film.findBy(mediaValues);

    if (!filmEntry) {
      const transaction: Transaction = await sequelize.transaction();
      try {
        filmEntry = await buildFilmEntry({ ...mediaValues, transaction });
        await transaction.commit();
      } catch (error) {
        //we always rollback if something fails
        await transaction.rollback();
        console.log('Rolling back');
        if (error instanceof AxiosError && error.status === 404) {
          //if it's a 404 Axios error, the film doesn't exist in TMDB.
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
    res.json(filmEntry);
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
