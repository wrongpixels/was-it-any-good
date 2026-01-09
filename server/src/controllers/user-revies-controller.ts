import express, { NextFunction, Request, Response, Router } from 'express';
import idFormatChecker from '../middleware/id-format-checker';
import { UserReview } from '../models';
import { toPlain, toPlainArray } from '../util/model-helpers';
import { UserReviewResults } from '../../../shared/types/models';

const router: Router = express.Router();

//get all reviews for an indexId.
//if activeUser is provided, it also fetches the user's own review
router.get(
  '/:id',
  idFormatChecker,
  async (req: Request, res: Response, _next: NextFunction) => {
    const indexId: string = req.params.id;
    const [allReviews, activeUserReview]: [UserReview[], UserReview | null] =
      await Promise.all([
        UserReview.findAllByIndexId(indexId),
        !req.activeUser
          ? null
          : UserReview.findOne({
              where: { indexId, userId: req.activeUser.id },
            }),
      ]);
    const userReviewResults: UserReviewResults = {
      totalResults: allReviews.length,
      page: 1,
      totalPages: 1,
      reviews: toPlainArray(allReviews),
      activeUserReview: activeUserReview ? toPlain(activeUserReview) : null,
    };
    res.json(userReviewResults);
  }
);

export default router;
