import { z } from 'zod';
import { MediaType } from '../../../shared/types/media';

export const CreateRatingSchema = z.object({
  mediaId: z.number(),
  mediaType: z.enum([
    MediaType.Film,
    MediaType.Show,
    MediaType.Game,
    MediaType.Season,
  ]),
  userScore: z.number().min(1).max(10),
});
