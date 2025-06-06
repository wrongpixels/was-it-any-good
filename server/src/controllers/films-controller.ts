//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import {
  buildCast,
  buildFilm,
  fetchFilm as fetchTMDBFilm,
} from '../services/film-service';
import { FilmData } from '../types/media/media-types';
import { Film, MediaRole } from '../models';

const router = express.Router();

router.get('/:id', async (req, res, _next) => {
  try {
    const id: string = req.params.id;
    let filmEntry: Film | null = await Film.findOne({
      where: { tmdbId: id.toString() },
      include: [
        {
          association: 'credits',
          include: [
            {
              association: 'person',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!filmEntry) {
      const filmData: FilmData = await fetchTMDBFilm(id);
      filmEntry = await Film.create(buildFilm(filmData));
      if (!filmEntry) {
        throw new CustomError('Film could not be created', 400);
      }
      const filmId = filmEntry.id;
      console.log('Created film!');
      const cast: MediaRole[] = await buildCast(
        filmData.cast,
        filmId,
        filmData.type
      );
      if (!cast) {
        throw new CustomError('Error creating cast', 400);
      }

      filmEntry = await Film.findByPk(filmId, {
        include: [
          {
            association: 'credits',
            include: [
              {
                association: 'person',
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      if (!filmEntry) {
        throw new CustomError('Error gathering just created Film', 400);
      }
    } else {
      console.log('Found film in db');
    }

    res.json(filmEntry);
  } catch (error) {
    res.json(error);
    //next(error);
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
