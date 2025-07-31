export const tmdbPaths = {
  films: {
    base: '/movie',
    byTMDBId: (id: string | number) => `${tmdbPaths.films.base}/${id}`,
    credits: (id: string | number) => `${tmdbPaths.films.byTMDBId(id)}/credits`,
  },
  shows: {
    base: '/tv',
    byTMDBId: (id: string | number) => `${tmdbPaths.shows.base}/${id}`,
    extendedCredits: (id: string | number) =>
      `${tmdbPaths.shows.byTMDBId(id)}/aggregate_credits`,
    credits: (id: string | number) => `${tmdbPaths.shows.byTMDBId(id)}/credits`,
    extIds: (id: string | number) =>
      `${tmdbPaths.shows.byTMDBId(id)}/external_ids`,
  },
  seasons: {
    credits: (showId: string | number, seasonId: string | number) =>
      `${tmdbPaths.shows.byTMDBId(showId)}/season/${seasonId}/credits`,
  },
};
