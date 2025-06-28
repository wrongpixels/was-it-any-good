import express, { Request, Router } from 'express';
import { CreateRatingSchema } from '../schemas/rating-schema';
import {
  CreateRating,
  CreateRatingData,
  RatingData,
} from '../../../shared/types/models';
import { activeUserExtractor } from '../middleware/user-extractor';
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

router.post('/', activeUserExtractor, async (req: Request, res, next) => {
  try {
    if (!req.activeUser) {
      throw new CustomError('Not logged in', 401);
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

router.delete('/:id', activeUserExtractor, async (req: Request, res, next) => {
  try {
    if (!req.activeUser) {
      throw new CustomError('Not logged in', 401);
    }
    const id: string = req.params.id;
    const rating: Rating | null = await Rating.findByPk(id);
    if (!rating) {
      throw new CustomError('Rating not found in db', 404);
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
