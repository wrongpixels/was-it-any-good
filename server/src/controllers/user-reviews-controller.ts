import express, { NextFunction, Request, Response, Router } from 'express';
import idFormatChecker from '../middleware/id-format-checker';
import { UserReview } from '../models';
import { toPlain, toPlainArray } from '../util/model-helpers';
import {
  CreateUserReviewData,
  UserReviewData,
  UserReviewResults,
} from '../../../shared/types/models';
import { authRequired } from '../middleware/auth-requirements';
import { AuthError, WrongFormatError } from '../util/customError';
import { CreateUserReviewSchema } from '../schemas/user-review-schema';
import { createUserReview } from '../services/user-reviews-service';

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

router.post(
  '/:id',
  idFormatChecker,
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: number | undefined = req.activeUser?.id;
      if (!userId) {
        throw new AuthError();
      }
      const indexId: number = Number(req.params.id);
      if (isNaN(indexId)) {
        throw new WrongFormatError('Media id must be numeric');
      }

      //zod will throw an error if something fails, se we assume it passed the check.
      const reviewData: CreateUserReviewData = CreateUserReviewSchema.parse(
        req.body
      );
      const newReviewResponse: UserReviewData = toPlain(
        await createUserReview(reviewData, indexId, userId)
      );
      res.status(201).json(newReviewResponse);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
