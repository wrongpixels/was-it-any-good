import { MediaType } from '../../../shared/types/media';
import { TMDB_URL } from '../../../shared/constants/url-constants';
import { API_BASE } from '../constants/url-constants';
import { IndexMediaData } from '../../../shared/types/models';
import { SearchType } from '../../../shared/types/search';

export const apiPaths = {
  films: {
    base: `${API_BASE}/films`,
    byId: (id: number | string) => `${apiPaths.films.base}/${id}`,
    byTMDBId: (id: number | string) => `${apiPaths.films.base}/tmdb/${id}`,
  },
  shows: {
    base: `${API_BASE}/shows`,
    byId: (id: number | string) => `${apiPaths.shows.base}/${id}`,
    byTMDBId: (id: number | string) => `${apiPaths.shows.base}/tmdb/${id}`,
  },
  people: {
    base: `${API_BASE}/people`,
    byId: (id: number | string) => `${apiPaths.people.base}/${id}`,
  },
  ratings: {
    base: `${API_BASE}/ratings`,
    matchById: (mediaType: MediaType, id: number) =>
      `${apiPaths.ratings.base}/match/${mediaType.toLowerCase()}/${id}`,
    byId: (id: number | string) => `${apiPaths.ratings.base}/${id}`,
  },
  users: {
    base: `${API_BASE}/users`,
    byId: (id: number | string) => `${apiPaths.users.base}/${id}`,
  },
  auth: {
    base: `${API_BASE}/auth`,
    login: () => `${apiPaths.auth.base}/login`,
    logout: () => `${apiPaths.auth.base}/logout`,
    sessions: {
      base: () => `${apiPaths.auth.base}/sessions`,
      verify: () => `${apiPaths.auth.sessions.base()}/verify`,
    },
  },
  suggestions: {
    base: `${API_BASE}/suggest`,
    byInput: (input: string) =>
      `${apiPaths.suggestions.base}?${new URLSearchParams({ query: input })}`,
  },
  search: {
    base: `${API_BASE}/search?`,
    byInput: (input: string) =>
      `${apiPaths.search.base}?${new URLSearchParams({ query: input })}`,
  },
};
export const routerPaths = {
  films: {
    base: '/film',
    byId: (id: number | string) => `${routerPaths.films.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${routerPaths.films.byId(id)}`,
  },
  shows: {
    base: '/show',
    byId: (id: number | string) => `${routerPaths.shows.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${routerPaths.shows.byId(id)}`,
  },
  people: {
    base: '/person',
    byId: (id: number | string) => `${routerPaths.people.base}/${id}`,
  },
  users: {
    base: '/user',
    byId: (id: number | string) => `${routerPaths.users.base}/${id}`,
  },
  search: {
    base: `/search`,
    byQuery: (query: string) => `${routerPaths.search.base}?${query}`,
    byTerm: (term: number | string) => `${routerPaths.search.base}?q=${term}`,
  },
};

export const buildRouterMediaLink = (
  mediaType: MediaType,
  id?: number | string,
  useTMDB?: boolean
): string => {
  switch (mediaType) {
    case MediaType.Film:
      return !id
        ? routerPaths.films.base
        : useTMDB
          ? routerPaths.films.byTMDBId(id)
          : routerPaths.films.byId(id);
    case MediaType.Show:
      return !id
        ? routerPaths.shows.base
        : useTMDB
          ? routerPaths.shows.byTMDBId(id)
          : routerPaths.shows.byId(id);
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
};

export const urlFromIndexMedia = (im: IndexMediaData): string =>
  im.addedToMedia && im.mediaId
    ? buildRouterMediaLink(im.mediaType, im.mediaId)
    : buildRouterMediaLink(im.mediaType, im.tmdbId, true);

export const getURLAfterDomain = () =>
  window.location.href.substring(window.location.origin.length);

export const buildOwnUrl = (path: string = ''): string =>
  `${window.location.origin}${path}`;

export const buildPathUrl = (path: string = ''): string =>
  `${window.location.pathname}${path}`;

export const mediaTypeToDisplayName = (mediaType: MediaType) => {
  switch (mediaType) {
    case MediaType.Film:
      return 'Film';
    case MediaType.Show:
      return 'TV Show';
    case MediaType.Season:
      return 'TV Season';
    default:
      return '';
  }
};

//Normalizes media type search parameters (m=...) into unified values ('film' or 'show'),
//handling various user inputs like 'movies', 'tv-shows', 'series' etc.
export const normalizeMediaSearchParams = (
  rawParams: string[]
): SearchType[] => {
  const resultParams: SearchType[] = [];
  const addToParams = (p: SearchType) => {
    if (!resultParams.includes(p)) {
      resultParams.push(p);
    }
  };
  rawParams.forEach((p: string) => {
    switch (p) {
      case 'film':
      case 'films':
      case 'movie':
      case 'movies':
        addToParams(SearchType.Film);
        break;
      case 'show':
      case 'shows':
      case 'tv':
      case 'tvshow':
      case 'tv-show':
      case 'tv-shows':
      case 'series':
        addToParams(SearchType.Show);
        break;
      /*      case 'person':
      case 'people':
      case 'actor':
      case 'actors':
      case 'director':
      case 'directors':
      case 'writer':
      case 'writers':
        addToParams(SearchType.Person);
        break;
     case 'season':
      case 'seasons':
      case 'tvseason':
      case 'tv-season':
      case 'tvseasons':
      case 'tv-seasons':
        addToParams(SearchType.Season);
        break; */
    }
  });

  return resultParams;
};

export const buildTMDBUrl = (
  mediaType: MediaType,
  path: string = ''
): string => {
  const url = TMDB_URL;
  const prefix: string = mediaType === MediaType.Show ? 'tv' : 'movie';
  return `${url}/${prefix}/${path}`;
};
