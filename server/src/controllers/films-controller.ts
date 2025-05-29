//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import { buildFilm, fetchFilm } from '../services/film-service';
import { FilmData } from '../types/media/media-types';
import { Film } from '../models';

const router = express.Router();

router.get('/:id', async (req, res, _next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: Film | null = await Film.findOne({
      where: { tmdbId: id.toString() },
    });
    if (!filmEntry) {
      const filmData: FilmData = await fetchFilm(id);
      const film: Film | null = await Film.create(buildFilm(filmData));
      console.log('Created film!');

      res.json(film);
      return;
    }
    console.log('Found film!');
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
