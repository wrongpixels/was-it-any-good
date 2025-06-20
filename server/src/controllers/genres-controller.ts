import express, { Router } from 'express';
import { Genre } from '../models';

const router: Router = express.Router();

router.get('/', async (_req, res, _next) => {
  const genres: Genre[] = await Genre.findAll();
  res.json(genres);
});

export default router;
