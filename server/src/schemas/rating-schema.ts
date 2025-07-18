import { z } from 'zod';
import { MediaType } from '../../../shared/types/media';

export const CreateRatingSchema = z.object({
  mediaId: z.number(),
  showId: z.number().optional(),
  mediaType: z.enum([MediaType.Film, MediaType.Show, MediaType.Season]),
  userScore: z.number().min(1).max(10),
});
