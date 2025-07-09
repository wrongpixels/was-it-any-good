import { z } from 'zod';
import { TMDBFilmSchema } from './tmdb-film-schema';
import { TMDBShowSchema } from './tmdb-show-schema';

export const TMDBIndexFilmSchema = TMDBFilmSchema.pick({
  id: true,
  poster_path: true,
  release_date: true,
  vote_average: true,
  title: true,
}).extend({
  popularity: z.number(),
});

export const TMDBIndexShowSchema = TMDBShowSchema.pick({
  id: true,
  poster_path: true,
  first_air_date: true,
  vote_average: true,
  name: true,
}).extend({
  popularity: z.number(),
});

export type TMDBIndexFilm = z.infer<typeof TMDBIndexFilmSchema>;
export type TMDBIndexShow = z.infer<typeof TMDBIndexShowSchema>;

export type TMDBIndexMedia = TMDBIndexFilm | TMDBIndexShow;
