import { MediaType, TMDBMediaType } from '../../../shared/types/media';
import { BASE_TMDB_URL } from '../../../shared/constants/url-constants';
import { IndexMediaData, MediaResponse } from '../../../shared/types/models';
import { SearchType } from '../../../shared/types/search';
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
  DEF_SORT_DIR,
} from '../../../shared/constants/url-param-constants';
import {
  OverrideParams,
  URLParameters,
} from '../../../shared/types/search-browse';
import { getDropdownValue } from '../../../shared/types/common';
import { clientPaths } from '../../../shared/util/url-builder';
import { buildTMDBorIMDBUrl } from '../services/media-service';

export const isQueryActiveInUrl = (query: string): boolean => {
  const searchURL: string = clientPaths.search.byQuery(query);
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
  const url = BASE_TMDB_URL;
  const prefix: string =
    mediaType === MediaType.Show ? TMDBMediaType.Show : TMDBMediaType.Film;
  return `${url}/${prefix}/${path}`;
};

export const buildTMDBUrlForIndexMedia = (
  indexMedia: IndexMediaData
): string => {
  if (!indexMedia.tmdbId) {
    return '';
  }
  return buildTMDBorIMDBUrl(indexMedia.mediaType, true, indexMedia.tmdbId);
};

export const buildTMDBUrlForMedia = (media: MediaResponse): string => {
  if (!media.tmdbId) {
    return '';
  }
  return buildTMDBorIMDBUrl(media.mediaType, true, media.tmdbId);
};

export const buildIMDBUrlForMedia = (media: MediaResponse): string => {
  if (!media.imdbId) {
    return '';
  }
  return buildTMDBorIMDBUrl(media.mediaType, false, media.imdbId);
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
      return 'TV Show';
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
    stringToSortBy(getDropdownValue(parameters.get(UPARAM_SORT_BY))) || null,
  sortDir:
    stringToSortDir(parameters.get(UPARAM_SORT_DIR)) ??
    overrideParams?.sortDir ??
    DEF_SORT_DIR,
});
