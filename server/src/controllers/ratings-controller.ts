import express, { NextFunction, Request, Response, Router } from 'express';
import { CreateRatingSchema } from '../schemas/rating-schema';
import {
  CreateRating,
  CreateRatingData,
  RatingData,
} from '../../../shared/types/models';
import CustomError from '../util/customError';
import { Rating } from '../models';
import { isAuthorizedUser } from '../util/session-verifier';

const router: Router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const allRatings: Rating[] = await Rating.findAll({});
    res.json(allRatings);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.activeUser?.isValid) {
      throw new CustomError('Unauthorized', 401);
    }
    const reqRating: CreateRating = CreateRatingSchema.parse(req.body);
    const ratingData: CreateRatingData = {
      ...reqRating,
      userId: req.activeUser.id,
    };
    const [ratingEntry, created]: [Rating, boolean | null] =
      await Rating.upsert(ratingData);
    const ratingResponse: RatingData = ratingEntry.get({ plain: true });
    res.status(created ? 201 : 200).json(ratingResponse);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/match/:mediaId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.activeUser?.isValid) {
        throw new CustomError('Unauthorized', 401);
      }
      const mediaId: string = req.params.mediaId;
      if (!mediaId) {
        throw new CustomError('Invalid media id', 400);
      }
      const userRating: Rating | null = await Rating.findOne({
        where: {
          mediaId,
          userId: req.activeUser.id,
        },
      });
      if (!userRating) {
        res.json(null);
        return;
      }
      const ratingResponse: RatingData = userRating.get({ plain: true });
      res.json(ratingResponse);
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
    const rating: Rating | null = await Rating.findByPk(id);
    if (!rating) {
      res.status(200).end();
      return;
    }
    if (!isAuthorizedUser(req.activeUser, rating.userId)) {
      throw new CustomError('Unauthorized', 403);
    }
    await rating.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
