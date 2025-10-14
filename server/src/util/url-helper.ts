import { TMDBSearchType } from '../../../shared/types/search';

export const tmdbPaths = {
  films: {
    base: '/movie',
    byTMDBId: (id: string | number) => `${tmdbPaths.films.base}/${id}`,
    //a single fetch that appends credits
    withCredits: (id: string | number) =>
      `${tmdbPaths.films.base}/${id}?append_to_response=credits`,
    credits: (id: string | number) => `${tmdbPaths.films.byTMDBId(id)}/credits`,
  },
  shows: {
    base: '/tv',
    byTMDBId: (id: string | number) => `${tmdbPaths.shows.base}/${id}`,
    //a single fetch that appends extended credits and external ids
    withCreditsAndIds: (id: string | number) =>
      `${tmdbPaths.shows.base}/${id}?append_to_response=aggregate_credits%2Cexternal_ids`,
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
  person: {
    base: '/person',
    byTMDBId: (id: string | number) => `${tmdbPaths.person.base}/${id}`,
  },
  search: {
    base: '/search',
    bySearchType: (term: string, searchType: TMDBSearchType, page?: string) =>
      `${tmdbPaths.search.base}/${searchType}?query=${term}&page=${page || 1}`,
    shows: (term: string, page?: string) =>
      tmdbPaths.search.bySearchType(term, TMDBSearchType.TV, page),
    films: (term: string, page?: string) =>
      tmdbPaths.search.bySearchType(term, TMDBSearchType.Movie, page),
  },
  discover: {
    base: '/discover',
    bySearchType: (searchType: TMDBSearchType, page?: string) =>
      `${tmdbPaths.discover.base}/${searchType}?page=${page || 1}`,
    shows: (page?: string) =>
      tmdbPaths.discover.bySearchType(TMDBSearchType.TV, page),
    films: (page?: string) =>
      tmdbPaths.discover.bySearchType(TMDBSearchType.Movie, page),
  },
  trending: {
    base: '/trending',
    bySearchType: (searchType: TMDBSearchType, page: string = '1') =>
      `${tmdbPaths.trending.base}/${searchType}/week?&page=${page || 1}`,
    shows: (page?: string) =>
      tmdbPaths.trending.bySearchType(TMDBSearchType.TV, page),
    films: (page?: string) =>
      tmdbPaths.trending.bySearchType(TMDBSearchType.Movie, page),
  },
};
