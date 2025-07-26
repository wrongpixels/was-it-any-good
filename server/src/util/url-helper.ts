export const tmdbPaths = {
  films: {
    base: '/movie',
    byTMDBId: (id: string | number) => `${tmdbPaths.films.base}/${id}`,
    credits: (id: string | number) => `${tmdbPaths.films.byTMDBId(id)}/credits`,
  },
  shows: {
    base: '/tv',
    byTMDBId: (id: string | number) => `${tmdbPaths.shows.base}/${id}`,
    credits: (id: string | number) => `${tmdbPaths.shows.byTMDBId(id)}/credits`,
    extIds: (id: string | number) =>
      `${tmdbPaths.shows.byTMDBId(id)}/external_ids`,
  },
};
