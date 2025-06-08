//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import {
  buildCredits,
  buildFilm,
  fetchFilm as fetchTMDBFilm,
} from '../services/film-service';
import { FilmData } from '../types/media/media-types';
import { Film, MediaRole } from '../models';

const router = express.Router();

router.get('/:id', async (req, res, _next) => {
  try {
    const id: string = req.params.id;
    let filmEntry: Film | null = await Film.scope('withCredits').findOne({
      where: { tmdbId: id.toString() },
    });

    if (!filmEntry) {
      const filmData: FilmData = await fetchTMDBFilm(id);
      filmEntry = await Film.create(buildFilm(filmData));
      if (!filmEntry) {
        throw new CustomError('Film could not be created', 400);
      }
      const filmId = filmEntry.id;
      console.log('Created film!');
      const credits: MediaRole[] | null = await buildCredits(filmData, filmId);
      if (!credits) {
        throw new CustomError('Error creating credits', 400);
      }
      filmEntry = await Film.scope('withCredits').findByPk(filmId);
      if (!filmEntry) {
        throw new CustomError('Error gathering just created Film', 400);
      }
    } else {
      console.log('Found film in db');
    }

    res.json(filmEntry);
  } catch (error) {
    console.log('Something went WRONG');
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
