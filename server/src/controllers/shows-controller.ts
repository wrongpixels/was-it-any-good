//import type { Request, Response } from 'express';
import express from 'express';
import { Show } from '../models';
import CustomError from '../util/customError';
import { buildShowEntry } from '../services/show-service';
import { sequelize } from '../util/db';
import { Transaction } from 'sequelize';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    let showEntry: Show | null = await Show.findOne({
      where: {
        tmdbId: id,
      },
    });
    if (!showEntry) {
      const transaction: Transaction = await sequelize.transaction();
      showEntry = await buildShowEntry(id, transaction);
    } else {
      console.log('Found Show in db');
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
