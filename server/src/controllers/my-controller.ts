//endpoint for logged in user related requests.

import express, { Request, Response, NextFunction, Router } from 'express';
import { RatingResults } from '../../../shared/types/models';
import { Rating } from '../models';
import { toPlainArray } from '../util/model-helpers';
import { extractURLParams } from '../util/url-param-extractor';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';
import { SortBy } from '../../../shared/types/browse';

const router: Router = express.Router();

//main router uses 'authRequired' middleware, so we only reach this routes when a
//verified req.activeUser has been detected

router.get(
  '/votes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchPage, sortBy, sortDir, findAndCountOptions } =
        extractURLParams(req);
      //SortBy rating must point to Rating's userScore
      if (sortBy === SortBy.Rating) {
        findAndCountOptions.order = [[SortBy.UserScore, sortDir.toUpperCase()]];
      }
      const { rows: ratings, count } = await Rating.findAndCountAll({
        where: {
          userId: 10,
        },
        ...findAndCountOptions,
        include: [
          {
            association: 'film',
          },
          {
            association: 'show',
          },
          {
            association: 'season',
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
