import express, { Request, Router } from 'express';
import { tmdbAPI } from '../util/config';
//import { tmdbAPI } from '../util/config';

const router: Router = express.Router();

router.get('/', async (req: Request, res, next) => {
  try {
    const query: string | undefined = req.query.q?.toString() || '';
    if (!query) {
      res.json({ error: 'no query' });
      return;
    }
    const { data } = await tmdbAPI.get(`/search/multi?query=${query}&page=1`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
