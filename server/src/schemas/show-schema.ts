import { z } from 'zod';

const TVDBEntrySchema = z.object({ id: z.number(), name: z.string() });

const TVDBRemoteIDSchema = z.object({ id: z.number(), sourceName: z.string() });

const TVDBStatusSchema = TVDBEntrySchema.extend({});

const TVDBStudioSchema = TVDBEntrySchema.extend({
  country: z.string(),
});
const TVDBGenreSchema = TVDBEntrySchema.extend({});

const TVDBPersonSchema = TVDBEntrySchema.extend({
  peopleType: z.string(),
  image: z.string().url(),
});

const TVDBCharacterSchema = TVDBPersonSchema.extend({
  peopleId: z.number(),
  personName: z.string(),
  personImageURL: z.string().url().nullable(),
  sort: z.number(),
});

const TVDBSeasonSchema = TVDBEntrySchema.extend({
  number: z.number(),
  type: TVDBEntrySchema,
  image: z.string().url().nullable(),
});

const TVDBEpisodeSchema = z.object({
  number: z.number(),
  year: z.number(),
});

export const TVDBExtendedSeasonSchema = TVDBSeasonSchema.extend({
  year: z.number(),
  episodes: z.array(TVDBEpisodeSchema),
});

export const TVDBShowInfoSchema = z.object({
  id: z.number(),
  genres: z.array(TVDBGenreSchema),
  name: z.string(),
  status: TVDBStatusSchema,
  originalCountry: z.string(),
  firstAired: z.string().date(),
  lastAired: z.string().date(),
  averageRuntime: z.number().int().min(0),
  overview: z.string(),
  image: z.string().url(),
  characters: z.array(TVDBCharacterSchema),
  companies: z.array(TVDBStudioSchema).nullable(),
  seasons: z.array(TVDBSeasonSchema),
  remoteIds: z.array(TVDBRemoteIDSchema).nullable(),
});
