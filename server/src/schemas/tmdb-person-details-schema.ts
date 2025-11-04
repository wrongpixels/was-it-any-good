import z from 'zod';

//we have to set both nullable and undefined as options, as TMDB likes to never
//specify which they'll use and use them randomly.
export const TMDBPersonDetailsSchema = z.object({
  birthday: z.string().optional().nullable(),
  deathday: z.string().optional().nullable(),
  biography: z.string().optional().nullable(),
  gender: z.number(),
  place_of_birth: z.string().optional().nullable(),
  profile_path: z.string().optional().nullable(),
});

export type TMDBPersonDetails = z.infer<typeof TMDBPersonDetailsSchema>;
