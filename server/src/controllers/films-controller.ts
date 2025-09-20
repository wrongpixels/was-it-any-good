import express, { NextFunction, Request, Response, Router } from 'express';
import CustomError, { NotFoundError } from '../util/customError';
import { Film } from '../models';
import { buildFilmEntry } from '../services/film-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { FilmResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';
import { MediaQueryValues } from '../types/media/media-types';
import { MediaType } from '../../../shared/types/media';
import idFormatChecker from '../middleware/id-format-checker';
import { useMediaCache } from '../middleware/redis-cache';
import { setMediaActiveCache } from '../util/redis-helpers';
const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const filmEntires: FilmResponse[] = await Film.findAll({ raw: true });
    res.json(filmEntires);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  useMediaCache(MediaType.Film),
  idFormatChecker,
  async (req: Request, res: Response, next: NextFunction) => {
    //we fetch and transform the data into our frontend interface using `plainData: true`.
    //this avoids handling a sequelize instance here and relying on express' toJSON().
    //We can't just use sequelize's 'raw:true' as it skips associations within scopes.
    try {
      const id: string = req.params.id;
      const filmEntry: FilmResponse | null = await Film.findBy({
        mediaId: id,
        activeUser: req.activeUser,
        plainData: true,
      });

      if (!filmEntry) {
        throw new NotFoundError('Film');
      }
      res.json(filmEntry);
      setMediaActiveCache(req, filmEntry);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/tmdb/:id',
  idFormatChecker,
  async (req: Request, res: Response, next: NextFunction) => {
    //we first try to find existing entries by tmdbId, if not, we fetch the data
    //from TMDB, add it to our db and return our own data.

    try {
      const id: string = req.params.id;
      const mediaValues: MediaQueryValues = {
        mediaId: id,
        mediaType: MediaType.Film,
        activeUser: req.activeUser,
        isTmdbId: true,
        plainData: true,
      };
      let filmEntry: FilmResponse | null = await Film.findBy(mediaValues);

      if (!filmEntry) {
        const transaction: Transaction = await sequelize.transaction();
        try {
          filmEntry = await buildFilmEntry({
            ...mediaValues,
            transaction,
          });
          await transaction.commit();
        } catch (error) {
          //we rollback if something fails
          await transaction.rollback();
          console.log('Rolling back');
          if (error instanceof AxiosError && error.status === 404) {
            //if it's a 404 Axios error, the film doesn't exist in TMDB.
            throw new NotFoundError('Film');
          }
          throw error;
        }
      }
      if (!filmEntry) {
        throw new NotFoundError('Film');
      }
      res.json(filmEntry);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/', async (_req: Request, res: Response, next: NextFunction) => {
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
