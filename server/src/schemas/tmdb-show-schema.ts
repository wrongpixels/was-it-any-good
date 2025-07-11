import { z } from 'zod';
import {
  TMDBCreditsSchema,
  TMDBEntrySchema,
  TMDBMediaSchema,
} from './tmdb-media-schema';

const TMDBCreatorSchema = TMDBEntrySchema.extend({
  gender: z.number().nullable(),
  profile_path: z.string().nullable(),
});

const TMDBSeasonSchema = TMDBEntrySchema.extend({
  episode_count: z.number().min(0),
  overview: z.string().nullable(),
  vote_average: z.number(),
  air_date: z.string().date().nullable(),
  season_number: z.number(),
  poster_path: z.string().nullable(),
});

export const TMDBShowInfoSchema = TMDBMediaSchema.extend({
  name: z.string(),
  original_name: z.string(),
  number_of_episodes: z.number().min(0),
  number_of_seasons: z.number().min(0),
  first_air_date: z.string().nullable().optional(),
  last_air_date: z.string().nullable().optional(),
  in_production: z.boolean(),
  episode_run_time: z.array(z.number()),
  created_by: z.array(TMDBCreatorSchema),
  seasons: z.array(TMDBSeasonSchema),
});

export const TMDBShowSchema = TMDBShowInfoSchema.extend({
  imdb_id: z.string().nullable(),
  credits: TMDBCreditsSchema,
});

export const TMDBExternalIdSchema = z.object({
  imdb_id: z.string().nullable(),
});

export type TMDBShowInfoData = z.infer<typeof TMDBShowInfoSchema>;
export type TMDBShowData = z.infer<typeof TMDBShowSchema>;
export type TMDBImdbData = z.infer<typeof TMDBExternalIdSchema>;
export type TMDBSeasonData = z.infer<typeof TMDBSeasonSchema>;
export type TMDBCreatorData = z.infer<typeof TMDBCreatorSchema>;
