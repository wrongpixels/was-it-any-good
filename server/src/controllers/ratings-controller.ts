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
      throw new CustomError('Unauthorized', 401);
    }
    const id: string = req.params.id;
    const rating: Rating | null = await Rating.findByPk(id);
    if (!rating) {
      throw new CustomError('Rating could not be found in db', 400);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
