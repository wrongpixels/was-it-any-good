//import type { Request, Response } from 'express';
import express, { Request, Router } from 'express';
import { Show } from '../models';
import CustomError, { NotFoundError } from '../util/customError';
import { buildShowEntry } from '../services/show-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';
import { ShowResponse } from '../../../shared/types/models';
import { AxiosError } from 'axios';
import { MediaQueryValues } from '../types/media/media-types';
import { MediaType } from '../../../shared/types/media';
import idFormatChecker from '../middleware/id-format-checker';
import { useCache } from '../middleware/redis-cache';
import { setActiveCache } from '../redis/redis-client';

const router: Router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const showEntries: ShowResponse[] = await Show.findAll({
      order: [['id', 'ASC']],
      raw: true,
    });
    res.json(showEntries);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  idFormatChecker,
  useCache<ShowResponse>({ baseKey: 'show', params: ['id'] }),
  async (req: Request, res, next) => {
    //we fetch and transform the data into our frontend interface using `plainData: true`.
    //this avoids handling a sequelize instance here and relying on express' toJSON().
    //We can't just use sequelize's 'raw:true' as it skips associations within scopes.
    try {
      const id: string = req.params.id;
      const showEntry = await Show.findBy({
        mediaId: id,
        activeUser: req.activeUser,
        plainData: true,
      });
      if (!showEntry) {
        throw new NotFoundError('Show');
      }
      res.json(showEntry);
      setActiveCache(req, showEntry);
    } catch (error) {
      next(error);
    }
  }
);
router.get('/tmdb/:id', idFormatChecker, async (req: Request, res, next) => {
  //we first try to find existing entries by tmdbId, if not, we fetch the data
  //from TMDB, add it to our db and return our own data.
  try {
    const id: string = req.params.id;
    const mediaValues: MediaQueryValues = {
      activeUser: req.activeUser,
      mediaId: id,
      mediaType: MediaType.Show,
      isTmdbId: true,
      plainData: true,
    };
    let showEntry: ShowResponse | null = await Show.findBy(mediaValues);
    if (!showEntry) {
      const transaction: Transaction = await sequelize.transaction();
      try {
        showEntry = await buildShowEntry({
          ...mediaValues,
          transaction,
        });
        await transaction.commit();
      } catch (error) {
        //we rollback if something fails
        await transaction.rollback();
        console.log('Rolling back');
        if (error instanceof AxiosError && error.status === 404) {
          //if it's a 404 Axios error, it means the logic run fine but the show doesn't exist in TMDB.
          throw new NotFoundError('Show');
        }
        throw error;
      }
    } else {
      console.log(showEntry);
    }
    if (!showEntry) {
      throw new NotFoundError('Show');
    }
    res.json(showEntry);
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
