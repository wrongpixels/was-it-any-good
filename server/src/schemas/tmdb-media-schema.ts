import { z } from 'zod';
import { TMDBShowData } from './tmdb-show-schema';
import { TMDBFilmData } from './tmdb-film-schema';

export const TMDBEntrySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const TMDBStudioSchema = TMDBEntrySchema.extend({
  logo_path: z.string().nullable(),
  origin_country: z.string(),
});

const TMDBGenreSchema = TMDBEntrySchema.extend({});

const TMDBCreditRoleSchema = TMDBEntrySchema.extend({
  adult: z.boolean(),
  gender: z.number(),
  credit_id: z.string(),
  known_for_department: z.string(),
  profile_path: z.string().nullable(),
});

const TMDBCastRoleSchema = TMDBCreditRoleSchema.extend({
  order: z.number(),
  character: z.string(),
});

const TMDBCrewSchema = TMDBCreditRoleSchema.extend({
  job: z.string(),
  department: z.string(),
});

export const TMDBCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(TMDBCastRoleSchema),
  crew: z.array(TMDBCrewSchema),
});

export const TMDBMediaSchema = z.object({
  id: z.number(),
  genres: z.array(TMDBGenreSchema),
  origin_country: z.array(z.string()),
  overview: z.string(),
  popularity: z.number(),
  vote_average: z.number(),
  poster_path: z.string().nullable(),
  status: z.string(),
  adult: z.boolean(),
  production_companies: z.array(TMDBStudioSchema),
});

export const isShow = (tmdb: TMDBMediaData): tmdb is TMDBShowData =>
  'number_of_episodes' in tmdb;

export type TMDBMediaData = TMDBShowData | TMDBFilmData;
export type TMDBCreditsData = z.infer<typeof TMDBCreditsSchema>;
export type TMDBGenreData = z.infer<typeof TMDBGenreSchema>;
export type TMDBCrewData = z.infer<typeof TMDBCrewSchema>;
export type TMDBRoleData = z.infer<typeof TMDBCastRoleSchema>;
export type TMDBStudioData = z.infer<typeof TMDBStudioSchema>;
export type TMDBEntryData = z.infer<typeof TMDBEntrySchema>;

export enum TMDBAcceptedDepartments {
  Writing = 'Writing',
  Directing = 'Directing',
  Acting = 'Acting',
  Sound = 'Sound',
}

export enum TMDBAcceptedJobs {
  Screenplay = 'Screenplay',
  Director = 'Director',
  OriginalMusicComposer = 'Original Music Composer',
  Producer = 'Producer',
  ExecutiveProducer = 'Executive Producer',
  Creator = 'Creator',
}
