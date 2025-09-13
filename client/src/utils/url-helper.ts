import { MediaType } from '../../../shared/types/media';
import { TMDB_URL } from '../../../shared/constants/url-constants';
import { API_BASE } from '../constants/url-constants';
import { IndexMediaData, MediaResponse } from '../../../shared/types/models';
import { SearchType } from '../../../shared/types/search';
import { getMediaId } from './index-media-helper';
import { toCountryCodes } from '../../../shared/types/countries';
import { stringToSortBy, stringToSortDir } from '../../../shared/types/browse';
import {
  UPARAM_COUNTRIES,
  UPARAM_PAGE,
  UPARAM_GENRES,
  UPARAM_SORT_BY,
  UPARAM_QUERY_TYPE,
  UPARAM_SEARCH_TERM,
  UPARAM_SORT_DIR,
  UPARAM_YEAR,
  DEF_SORT_BY,
  DEF_SORT_DIR,
} from '../../../shared/constants/url-param-constants';
import {
  OverrideParams,
  URLParameters,
} from '../../../shared/types/search-browse';

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
  genres: {
    base: `${API_BASE}/genres`,
    byId: (id: number | string) => `${apiPaths.genres.base}/${id}`,
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
    base: `${API_BASE}/search`,
    byQuery: (query: string) => `${apiPaths.search.base}?${query}`,
  },
  trending: `${API_BASE}/trending`,

  browse: {
    base: `${API_BASE}/browse`,
    byQuery: (query: string) => `${apiPaths.browse.base}?${query}`,
  },
  my: {
    base: `${API_BASE}/my`,
    votes: () => `${apiPaths.my.base}/votes`,
  },
};
export const routerPaths = {
  home: '/',
  films: {
    base: '/film',
    idParam: () => `${routerPaths.films.base}/:id`,
    TMDBIdParam: () => `/tmdb${routerPaths.films.base}/:id`,
    byId: (id: number | string) => `${routerPaths.films.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${routerPaths.films.byId(id)}`,
  },
  shows: {
    base: '/show',
    idParam: () => `${routerPaths.shows.base}/:id`,
    TMDBIdParam: () => `/tmdb${routerPaths.shows.base}/:id`,
    byId: (id: number | string) => `${routerPaths.shows.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${routerPaths.shows.byId(id)}`,
  },
  people: {
    base: '/person',
    withParam: () => `${routerPaths.people.base}/:id`,
    byId: (id: number | string) => `${routerPaths.people.base}/${id}`,
  },
  users: {
    base: '/user',
    withParam: () => `${routerPaths.users.base}/:id`,
    byId: (id: number | string) => `${routerPaths.users.base}/${id}`,
  },
  search: {
    base: `/search`,
    query: () => `${routerPaths.search.base}?`,
    byQuery: (query: string) => `${routerPaths.search.query()}${query}`,
    byTerm: (term: number | string) => `${routerPaths.search.query()}q=${term}`,
  },
  browse: {
    base: '/browse',
    query: () => `${routerPaths.browse.base}?`,
    byQuery: (query: string) => `${routerPaths.browse.query()}${query}`,
  },
  tops: {
    base: '/top',
    shows: {
      base: () => `${routerPaths.tops.base}/shows`,
      query: () => `${routerPaths.tops.shows.base()}?`,
      withQuery: (query: string) => `${routerPaths.tops.shows.query()}${query}`,
    },
    films: {
      base: () => `${routerPaths.tops.base}/films`,
      query: () => `${routerPaths.tops.films.base()}?`,
      withQuery: (query: string) => `${routerPaths.tops.films.query()}${query}`,
    },
    multi: {
      base: () => `${routerPaths.tops.base}/media`,
      query: () => `${routerPaths.tops.multi.base()}?`,
      withQuery: (query: string) => `${routerPaths.tops.multi.query()}${query}`,
    },
  },
  popular: {
    base: '/popular',
    shows: {
      base: () => `${routerPaths.popular.base}/shows`,
      query: () => `${routerPaths.popular.shows.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.popular.shows.query()}${query}`,
    },
    films: {
      base: () => `${routerPaths.popular.base}/films`,
      query: () => `${routerPaths.popular.films.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.popular.films.query()}${query}`,
    },
    multi: {
      base: () => `${routerPaths.popular.base}/media`,
      query: () => `${routerPaths.popular.multi.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.popular.multi.query()}${query}`,
    },
  },
  my: {
    base: '/my',
    votes: () => `${routerPaths.my.base}/votes`,
  },
  trending: {
    base: '/trending',
    shows: {
      base: () => `${routerPaths.trending.base}/shows`,
      query: () => `${routerPaths.trending.shows.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.trending.shows.query()}${query}`,
    },
    films: {
      base: () => `${routerPaths.trending.base}/films`,
      query: () => `${routerPaths.trending.films.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.trending.films.query()}${query}`,
    },
    multi: {
      base: () => `${routerPaths.trending.base}/media`,
      query: () => `${routerPaths.trending.multi.base()}?`,
      withQuery: (query: string) =>
        `${routerPaths.trending.multi.query()}${query}`,
    },
  },
};

export const mediaPaths = {
  countries: {
    base: '/flags',
    byCode: (code: string) =>
      `${mediaPaths.countries.base}/${code.toLowerCase()}.svg`,
  },
};

export const buildMediaLink = (media: MediaResponse) => {
  return buildRouterMediaLink(media.mediaType, media.id);
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

export const urlFromIndexMedia = (im: IndexMediaData): string => {
  const mediaId: number | null = getMediaId(im);
  return mediaId
    ? buildRouterMediaLink(im.mediaType, mediaId)
    : buildRouterMediaLink(im.mediaType, im.tmdbId, true);
};

export const isQueryActiveInUrl = (query: string): boolean => {
  const searchURL: string = routerPaths.search.byQuery(query);
  return searchURL === getURLAfterDomain();
};

export const getURLAfterDomain = () =>
  window.location.href.substring(window.location.origin.length);

export const buildOwnUrl = (path: string = ''): string =>
  `${window.location.origin}${path}`;

export const buildPathUrl = (path: string = ''): string =>
  `${window.location.pathname}${path}`;

export const buildTMDBUrl = (
  mediaType: MediaType,
  path: string = ''
): string => {
  const url = TMDB_URL;
  const prefix: string = mediaType === MediaType.Show ? 'tv' : 'movie';
  return `${url}/${prefix}/${path}`;
};

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

export const queryTypeToDisplayName = (searchType: SearchType[]) => {
  if (searchType.length > 1 || searchType.length === 0) {
    return '';
  }
  switch (searchType[0]) {
    case SearchType.Film:
      return 'Film';
    case SearchType.Show:
      return 'TV';
    default:
      return '';
  }
};

//Normalizes media type search parameters (m=...) into unified values ('film' or 'show'),
//handling various user inputs like 'movies', 'tv-shows', 'series' etc.
//it also adds show and films by default if none is selected.
export const normalizeQueryTypeParams = (rawParams: string[]): SearchType[] => {
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
  if (resultParams.length === 0) {
    resultParams.push(SearchType.Film, SearchType.Show);
  }
  return resultParams;
};

export const extractURLParameters = (
  parameters: URLSearchParams,
  overrideParams?: OverrideParams
): URLParameters => ({
  searchTerm: parameters.get(UPARAM_SEARCH_TERM),
  searchPage: Number(parameters.get(UPARAM_PAGE)),
  queryType: normalizeQueryTypeParams(parameters.getAll(UPARAM_QUERY_TYPE)),
  genres: parameters.getAll(UPARAM_GENRES),
  countries: toCountryCodes(parameters.getAll(UPARAM_COUNTRIES)),
  year: parameters.get(UPARAM_YEAR),
  sortBy:
    overrideParams?.sortBy ??
    stringToSortBy(parameters.get(UPARAM_SORT_BY)) ??
    DEF_SORT_BY,
  sortDir:
    overrideParams?.sortDir ??
    stringToSortDir(parameters.get(UPARAM_SORT_DIR)) ??
    DEF_SORT_DIR,
});
