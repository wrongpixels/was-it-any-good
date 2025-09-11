//endpoint for logged in user related requests.

import express, { Request, Response, NextFunction, Router } from 'express';
import { RatingData } from '../../../shared/types/models';
import { Rating } from '../models';
import { toPlainArray } from '../util/model-helpers';

const router: Router = express.Router();

//main router uses 'authRequired' middleware, so we only reach this routes when a
//verified req.activeUser has been detected

router.get('votes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ratings: Rating[] = await Rating.findAll({
      where: {
        userId: req.activeUser?.id,
      },
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
    const ratingsResponse: RatingData[] = toPlainArray(ratings);
    res.json(ratingsResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
