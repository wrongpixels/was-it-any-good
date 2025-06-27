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
    const [ratingEntry] = await Rating.upsert({
      userId: ratingData.userId,
      mediaId: ratingData.mediaId,
      mediaType: ratingData.mediaType,
      userScore: ratingData.userScore,
    });
    const ratingResponse: RatingData = ratingEntry.get({ plain: true });
    res.status(201).json(ratingResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
