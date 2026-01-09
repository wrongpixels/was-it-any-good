import z from 'zod';
import { RecommendType } from '../../../shared/types/user-reviews';
import {
  MAX_REVIEW_CONTENT_LENGTH,
  MAX_REVIEW_SPOILER_LENGTH,
  MAX_REVIEW_TITLE_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_TITLE_LENGTH,
} from '../../../shared/constants/user-review-constants';

export const CreateUserReviewSchema = z.object({
  title: z
    .string()
    .trim()
    .min(MIN_REVIEW_TITLE_LENGTH)
    .max(MAX_REVIEW_TITLE_LENGTH),
  seasons: z.array(z.number()).optional(),
  mainContent: z
    .string()
    .trim()
    .min(MIN_REVIEW_CONTENT_LENGTH)
    .max(MAX_REVIEW_CONTENT_LENGTH),
  spoilerContent: z
    .string()
    .trim()
    .min(MIN_REVIEW_CONTENT_LENGTH)
    .max(MAX_REVIEW_SPOILER_LENGTH)
    .nullable(),
  recommended: z.number().min(0).max(RecommendType.Mixed),
});
