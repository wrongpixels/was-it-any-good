import { z } from 'zod';
import { TMDBFilmSchema } from './tmdb-film-schema';
import { TMDBShowSchema } from './tmdb-show-schema';

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
  release_date: true,
  vote_average: true,
  title: true,
  popularity: true,
  origin_country: true,
}).extend({
  media_type: z.string().optional(),
});

export const TMDBIndexShowSchema = TMDBShowSchema.pick({
  id: true,
  poster_path: true,
  first_air_date: true,
  vote_average: true,
  name: true,
  popularity: true,
  origin_country: true,
}).extend({
  media_type: z.string().optional(),
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
    TMDBIndexFilmSchema.extend({ media_type: z.literal('movie') }),
    TMDBIndexShowSchema.extend({ media_type: z.literal('tv') }),
  ])
);
