import { z } from 'zod';
import { TMDBFilmCreditsSchema, TMDBMediaSchema } from './tmdb-media-schema';

export const TMDBFilmInfoSchema = TMDBMediaSchema.extend({
  title: z.string(),
  imdb_id: z.string().nullable(),
  original_title: z.string(),
  release_date: z.string().nullable(),
  runtime: z.number().int().min(0),
  credits: TMDBFilmCreditsSchema,
});

export const TMDBFilmSchema = TMDBFilmInfoSchema.extend({
  credits: TMDBFilmCreditsSchema,
});
export type TMDBFilmData = z.infer<typeof TMDBFilmSchema>;

export type TMDBFilmInfoData = z.infer<typeof TMDBFilmInfoSchema>;
