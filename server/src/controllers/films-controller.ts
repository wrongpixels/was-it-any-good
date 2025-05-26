//import type { Request, Response } from 'express';
import express from 'express';
import { Media } from '../models';
import CustomError from '../util/customError';
import { fetchFilm } from '../services/films-service';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const data = await fetchFilm(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newEntry = await Media.create(req.body);
    if (!newEntry) {
      throw new CustomError('Data format is not valid', 400);
    }
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});
export default router;
