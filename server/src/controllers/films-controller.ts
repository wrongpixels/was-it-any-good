//import type { Request, Response } from 'express';
import express from 'express';
import CustomError from '../util/customError';
import { Film } from '../models';
import { buildFilmEntry } from '../services/film-service';
import { sequelize } from '../util/db';
const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;

    let filmEntry = await Film.scope('withCredits').findOne({
      where: { tmdbId: id.toString() },
    });

    if (!filmEntry) {
      const transaction = await sequelize.transaction();
      try {
        filmEntry = await buildFilmEntry(id, transaction);
        await transaction.commit();
      } catch (error) {
        console.log('Rolling back');
        await transaction.rollback();
        throw error;
      }
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
