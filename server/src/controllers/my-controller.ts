//endpoint for logged in user related requests.

import express, { Request, Response, NextFunction, Router } from 'express';
import { RatingResults } from '../../../shared/types/models';
import { Rating } from '../models';
import { toPlainArray } from '../util/model-helpers';
import { extractURLParams } from '../util/url-param-extractor';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';

const router: Router = express.Router();

//main router uses 'authRequired' middleware, so we only reach this routes when a
//verified req.activeUser has been detected

router.get(
  '/votes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchPage, where, findAndCountOptions } = extractURLParams(req);
      const { rows: ratings, count } = await Rating.findAndCountAll({
        where: {
          userId: 10,
        },
        ...findAndCountOptions,
        include: [
          {
            association: 'film',
            where,
          },
          {
            association: 'show',
            where,
          },
          {
            association: 'season',
            where,
          },
        ],
      });
      const ratingsResults: RatingResults = {
        page: searchPage,
        totalPages: Math.ceil(count / PAGE_LENGTH) || 1,
        totalResults: count,
        ratings: toPlainArray(ratings),
      };
      res.json(ratingsResults);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
