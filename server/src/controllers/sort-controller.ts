import express, { Router } from 'express';
import { TMDBSearchType } from '../../../shared/types/search';
import { extractQuery, arrayToTMDBSearchTypes } from '../util/search-helpers';
import { IndexMediaData } from '../../../shared/types/models';
import { IndexMedia } from '../models';
import { Op } from 'sequelize';

const router: Router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const searchTypeString: string[] = extractQuery(req.query.m);
    const searchPage: string = req.query.page?.toString() ?? '1';
    const genreString: string[] = extractQuery(req.query.g);
    const countryString: string | undefined = req.query.c?.toString();
    const year: string | undefined = req.query.y?.toString();
    const orderBy: string | undefined = req.query.orderBy?.toString();
    const sortyBy: string | undefined = req.query.sortyBy?.toString();

    if (searchTypeString.length < 1) {
      res.json(null);
      return;
    }
    console.log(year);
    const searchType: TMDBSearchType =
      arrayToTMDBSearchTypes(searchTypeString)[0];
    const matches: IndexMediaData[] = await IndexMedia.findAll({
      raw: true,
      where: {
        year,
      },
      order: [['baseRating', 'ASC']],
      limit: 20,
    });
    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;
