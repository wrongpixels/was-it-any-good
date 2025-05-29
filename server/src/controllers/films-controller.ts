//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import { fetchFilm } from '../services/film-service';
import { FilmData } from '../types/media/media-types';
import { Film, Person } from '../models';
import { DEF_IMAGE_PERSON } from '../types/media/media-defaults';

const router = express.Router();

router.get('/:id', async (req, res, _next) => {
  try {
    const id: string = req.params.id;
    const filmEntry: Film | null = await Film.findOne({
      where: { tmdbId: id.toString() },
    });
    if (!filmEntry) {
      const person = await Person.create({
        name: 'Roger Rogerson',
        tmdbId: '122323',
        image: DEF_IMAGE_PERSON,
        country: ['ES'],
      });
      res.json(person);
      return;
    }
    const data: FilmData = await fetchFilm(id);
    res.json(data);
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
