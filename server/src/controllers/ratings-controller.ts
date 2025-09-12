import express, { NextFunction, Request, Response, Router } from 'express';
import { CreateRatingSchema } from '../schemas/rating-schema';
import {
  CreateRating,
  CreateRatingData,
  RatingData,
  CreateRatingResponse,
  RatingStats,
  RemoveRatingResponse,
} from '../../../shared/types/models';
import CustomError, { AuthError } from '../util/customError';
import { Media, Rating } from '../models';
import { isAuthorizedUser } from '../util/session-verifier';
import { MediaType } from '../../../shared/types/media';
import { stringToMediaType } from '../../../shared/helpers/media-helper';
import { authRequired } from '../middleware/auth-requirements';

const router: Router = express.Router();

router.get(
  '/',
  /* adminRequired,*/ async (_req, res, next) => {
    try {
      const allRatings: RatingData[] = await Rating.findAll({ raw: true });
      res.json(allRatings);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //merely for TS, the middleware already did the job
      if (!req.activeUser) {
        throw new AuthError();
      }
      const reqRating: CreateRating = CreateRatingSchema.parse(req.body);
      const ratingData: CreateRatingData = {
        ...reqRating,
        userId: req.activeUser?.id,
      };
      const [ratingEntry, created]: [Rating, boolean | null] =
        await Rating.upsert(ratingData);
      const ratingStats: RatingStats = await Media.refreshRatings(
        ratingEntry.mediaId,
        ratingEntry.mediaType
      );
      const ratingResponse: CreateRatingResponse = {
        ...ratingEntry.get({ plain: true }),
        ratingStats,
      };
      res.status(created ? 201 : 200).json(ratingResponse);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/match/:media/:mediaId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.activeUser?.isValid) {
        throw new CustomError('Unauthorized', 401);
      }
      const mediaId: string = req.params.mediaId;
      const mediaType: MediaType | null = stringToMediaType(req.params.media);
      if (!mediaId || !mediaType) {
        throw new CustomError('Invalid media id', 400);
      }
      const userRating: RatingData | null = await Rating.findOne({
        where: {
          mediaId,
          mediaType,
          userId: req.activeUser.id,
        },
        raw: true,
      });
      if (!userRating) {
        res.json(null);
        return;
      }
      res.json(userRating);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req: Request, res, next) => {
  try {
    if (!req.activeUser) {
      throw new CustomError('Not logged in', 401);
    }
    const id: string = req.params.id;

    //we find the rating first so we can return its data
    const rating: Rating | null = await Rating.findByPk(id);
    if (!rating) {
      res.status(204).end();
      return;
    }
    //if userId doesn't match the one of the rating or not an admin, we stop here
    if (!isAuthorizedUser(req.activeUser, rating.userId)) {
      throw new CustomError('Unauthorized', 403);
    }
    //the instance should remain in memory after removed from the db, but it's good practices.
    const ratingData: RatingData = rating.get({ plain: true });
    await rating.destroy();
    const ratingStats: RatingStats = await Media.refreshRatings(
      ratingData.mediaId,
      ratingData.mediaType
    );
    const ratingResponse: RemoveRatingResponse = {
      ...ratingData,
      ratingStats,
    };
    res.status(200).json(ratingResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
