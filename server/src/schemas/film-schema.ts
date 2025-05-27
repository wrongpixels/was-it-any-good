import { z } from 'zod';

const TMDBEntrySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const TMDBStudioSchema = TMDBEntrySchema.extend({
  logo_path: z.string().nullable(),
  origin_country: z.string(),
});

const TMDBGenreSchema = TMDBEntrySchema.extend({});

const TMDBRoleSchema = TMDBEntrySchema.extend({
  adult: z.boolean(),
  gender: z.number(),
  credit_id: z.string(),
  known_for_department: z.string(),
});

const TMDBCastSchema = TMDBRoleSchema.extend({
  order: z.number(),
  character: z.string(),
});

const TMDBCrewSchema = TMDBRoleSchema.extend({
  job: z.string(),
  department: z.string(),
});

export const TMDBCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(TMDBCastSchema),
  crew: z.array(TMDBCrewSchema),
});

export const TMDBFilmInfoSchema = z.object({
  id: z.number(),
  genres: z.array(TMDBGenreSchema),
  imdb_id: z.string(),
  title: z.string(),
  original_title: z.string(),
  origin_country: z.array(z.string()),
  overview: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string().date(),
  runtime: z.number().int().min(0),
  status: z.string(),
  adult: z.boolean(),
  production_companies: z.array(TMDBStudioSchema),
});

export const TMDBFilmSchema = TMDBFilmInfoSchema.extend({
  credits: TMDBCreditsSchema,
});

export type TMDBFilmInfoData = z.infer<typeof TMDBFilmInfoSchema>;
export type TMDBFilmData = z.infer<typeof TMDBFilmSchema>;
export type TMDBCreditsData = z.infer<typeof TMDBCreditsSchema>;
export type TMDBGenreData = z.infer<typeof TMDBGenreSchema>;
export type TMDBCrewData = z.infer<typeof TMDBCrewSchema>;

export type TMDBAcceptedDepartments =
  | 'Writing'
  | 'Directing'
  | 'Acting'
  | 'Sound';

export enum TMDBAcceptedJobs {
  Screenplay = 'Screenplay',
  Director = 'Director',
  OriginalMusicComposer = 'Original Music Composer',
}
