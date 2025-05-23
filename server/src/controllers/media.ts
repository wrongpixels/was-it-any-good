import express from 'express';
import { Media } from '../models';
import CustomError from '../util/customError';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const entries = await Media.findAll();
    res.json(entries);
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
