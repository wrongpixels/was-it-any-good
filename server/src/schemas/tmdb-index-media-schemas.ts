import { z } from 'zod';
import { TMDBFilmSchema } from './tmdb-film-schema';
import { TMDBShowSchema } from './tmdb-show-schema';
import { TMDBMediaType } from '../../../shared/types/media';

export const TMDBSearchSchema = z.object({
  page: z.number(),
  results: z.array(z.any()),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TMDBSearchResult = z.infer<typeof TMDBSearchSchema>;

export const TMDBIndexFilmSchema = TMDBFilmSchema.pick({
  id: true,
  poster_path: true,
  title: true,
  origin_country: true,
}).extend({
  media_type: z.string().optional(),
  release_date: z.string().optional().default(''),
  vote_average: z.number().optional().default(0),
  popularity: z.number().optional().default(0),
});

export const TMDBIndexShowSchema = TMDBShowSchema.pick({
  id: true,
  poster_path: true,
  name: true,
  origin_country: true,
}).extend({
  media_type: z.string().optional(),
  first_air_date: z.string().optional().default(''),
  vote_average: z.number().optional().default(0),
  popularity: z.number().optional().default(0),
});

export const TMDBIndexPersonSchema = z.object({
  id: z.number(),
  media_type: z.string().optional(),
  name: z.string(),
  profile_path: z.string().optional(),
});

export type TMDBIndexFilm = z.infer<typeof TMDBIndexFilmSchema>;
export type TMDBIndexShow = z.infer<typeof TMDBIndexShowSchema>;

export type TMDBIndexMedia = TMDBIndexFilm | TMDBIndexShow;

export const TMDBIndexFilmArraySchema = z.array(TMDBIndexFilmSchema);
export const TMDBIndexShowArraySchema = z.array(TMDBIndexShowSchema);

export const TMDBMultiSearchResultSchema = z.array(
  z.discriminatedUnion('media_type', [
    TMDBIndexFilmSchema.extend({ media_type: z.literal(TMDBMediaType.Film) }),
    TMDBIndexShowSchema.extend({ media_type: z.literal(TMDBMediaType.Show) }),
  ])
);
