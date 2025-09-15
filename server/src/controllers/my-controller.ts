//endpoint for logged in user related requests.

import express, { Request, Response, NextFunction, Router } from 'express';
import { extractURLParams } from '../util/url-param-extractor';
import { PAGE_LENGTH_VOTES } from '../../../shared/types/search-browse';
import { SortBy } from '../../../shared/types/browse';
import { Rating } from '../models';
import { RatingData, RatingResults } from '../../../shared/types/models';
import { toPlainArray } from '../util/model-helpers';
import { AuthError } from '../util/customError';
import { getMyVotesOrder } from '../services/my-service';
import { DEF_SORT_BY } from '../../../shared/constants/url-param-constants';

const router: Router = express.Router();

//main router uses 'authRequired' middleware, so we only reach this routes when a
//verified req.activeUser has been detected

router.get(
  '/votes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.activeUser) {
        throw new AuthError();
      }
      const { searchPage, sortBy, sortDir, findAndCountOptions } =
        extractURLParams(req);

      findAndCountOptions.limit = PAGE_LENGTH_VOTES;
      findAndCountOptions.offset = PAGE_LENGTH_VOTES * (searchPage - 1);

      if (sortBy === SortBy.Rating) {
        findAndCountOptions.order = [[SortBy.UserScore, sortDir.toUpperCase()]];
      }
      findAndCountOptions.order = getMyVotesOrder(
        sortBy || DEF_SORT_BY,
        sortDir
      );
      console.log(sortBy);
      const userId: number = req.activeUser.id;

      const { rows: ratings, count } = await Rating.findAndCountAll({
        where: {
          userId,
        },
        include: {
          association: 'indexMedia',
        },
        ...findAndCountOptions,
      });

      const cleanRatings: RatingData[] = toPlainArray(ratings);

      const ratingsResults: RatingResults = {
        page: searchPage,
        totalPages: Math.ceil(count / PAGE_LENGTH_VOTES) || 1,
        totalResults: count,
        ratings: cleanRatings,
        resultsType: 'votes',
      };
      res.json(ratingsResults);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
