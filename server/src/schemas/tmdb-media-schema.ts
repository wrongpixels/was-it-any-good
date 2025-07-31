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

const TMDBFilmCastRoleSchema = TMDBCreditRoleSchema.extend({
  order: z.number(),
  character: z.string(),
});
const TMDBActorRoleSchema = z.object({
  credit_id: z.string(),
  character: z.string(),
  episode_count: z.number(),
});

const TMDBShowCastRoleSchema = TMDBCreditRoleSchema.omit({
  credit_id: true,
}).extend({
  order: z.number(),
  roles: z.array(TMDBActorRoleSchema),
});

const TMDBFilmCrewSchema = TMDBCreditRoleSchema.extend({
  job: z.string(),
  department: z.string(),
});
const TMDBCrewJobSchema = z.object({
  credit_id: z.string(),
  job: z.string(),
  episode_count: z.number(),
});
const TMDBShowCrewSchema = TMDBCreditRoleSchema.omit({
  credit_id: true,
}).extend({
  jobs: z.array(TMDBCrewJobSchema),
  department: z.string(),
});

export const TMDBFilmCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(TMDBFilmCastRoleSchema),
  crew: z.array(TMDBFilmCrewSchema),
});

export const TMDBShowCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(TMDBShowCastRoleSchema),
  crew: z.array(TMDBShowCrewSchema),
});

export const TMDBMediaSchema = z.object({
  id: z.number(),
  genres: z.array(TMDBGenreSchema),
  origin_country: z.array(z.string()).optional(),
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

export type TMDBActorRole = z.infer<typeof TMDBActorRoleSchema>;
export type TMDBCrewJob = z.infer<typeof TMDBCrewJobSchema>;
export type TMDBMediaData = TMDBShowData | TMDBFilmData;
export type TMDBCreditsData = z.infer<typeof TMDBFilmCreditsSchema>;
export type TMDBShowCreditsData = z.infer<typeof TMDBShowCreditsSchema>;
export type TMDBGenreData = z.infer<typeof TMDBGenreSchema>;
export type TMDBCrewData = z.infer<typeof TMDBFilmCrewSchema>;
export type TMDBShowCrewData = z.infer<typeof TMDBShowCrewSchema>;
export type TMDBCastRoleData = z.infer<typeof TMDBFilmCastRoleSchema>;
export type TMDBShowCastRoleData = z.infer<typeof TMDBShowCastRoleSchema>;
export type TMDBStudioData = z.infer<typeof TMDBStudioSchema>;
export type TMDBEntryData = z.infer<typeof TMDBEntrySchema>;

export enum TMDBAcceptedJobs {
  Screenplay = 'Screenplay',
  Director = 'Director',
  OriginalMusicComposer = 'Original Music Composer',
  Producer = 'Producer',
  ExecutiveProducer = 'Executive Producer',
  Creator = 'Creator',
  Writer = 'Writer',
}
export const acceptedJobs: string[] = Object.values<string>(TMDBAcceptedJobs);
