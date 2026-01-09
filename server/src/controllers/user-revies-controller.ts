import express, { NextFunction, Request, Response, Router } from 'express';
import idFormatChecker from '../middleware/id-format-checker';
import { IndexMedia, Rating, UserReview } from '../models';
import { toPlain, toPlainArray } from '../util/model-helpers';
import {
  CreateUserReview,
  CreateUserReviewData,
  UserReviewData,
  UserReviewResults,
} from '../../../shared/types/models';
import { authRequired } from '../middleware/auth-requirements';
import CustomError, {
  AuthError,
  NotFoundError,
  WrongFormatError,
} from '../util/customError';
import { isUnreleased } from '../../../shared/helpers/media-helper';
import { CreateUserReviewSchema } from '../schemas/user-review-schema';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';

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

      const transaction: Transaction = await sequelize.transaction();
      try {
        //we get the media to verify it exists in the db.
        //we also look for any existing rating by the user for that media.
        //we get just the ids as we don't need the rest of full entries.
        const [media, rating]: [IndexMedia | null, Rating | null] =
          await Promise.all([
            //for the media, we also get the releaseDate.
            IndexMedia.findByPk(indexId, {
              attributes: ['id', 'releaseDate'],
              transaction,
            }),
            Rating.findOne({
              where: {
                userId,
                indexId,
              },
              attributes: ['id'],
              transaction,
            }),
          ]);

        //if no media found, the id is wrong and we do not allow for the review
        //to be published.
        //rating can be null, as we allow users to unvote or review without voting.
        if (!media) {
          throw new NotFoundError('Media does not exist.');
        }

        //if the media is not released yet, the user cannot vote.
        if (isUnreleased(media.releaseDate)) {
          throw new CustomError(
            'This media is not be released yet, so it cannot be reviewed.',
            409,
            'ConflictError',
            'MEDIA_UNRELEASED'
          );
        }
        //if we found an existing Rating, we extract its id.
        const ratingId: number | null = rating?.id || null;

        //and now, we have all the info to post the review.
        const createReview: CreateUserReview = {
          ...reviewData,
          userId,
          indexId,
          ratingId,
        };

        const newReviewEntry: UserReview = await UserReview.create(
          createReview,
          {
            transaction,
          }
        );
        await transaction.commit();
        const newReviewResponse: UserReviewData = toPlain(newReviewEntry);
        res.status(201).json(newReviewResponse);
      } catch (error: unknown) {
        await transaction.rollback();
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
