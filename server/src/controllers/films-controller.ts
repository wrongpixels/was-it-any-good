//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import { fetchFilm } from '../services/film-service';
import { FilmData } from '../types/media/media-types';
import { Film } from '../models';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: Film | null = await Film.findOne({
      where: { tmdbId: id },
    });
    if (!filmEntry) {
      res.send('Entry does not exist in DB!');
      return;
    }
    const data: FilmData = await fetchFilm(id);
    res.json(data);
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
