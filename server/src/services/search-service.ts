import { isStringANumber } from '../../../shared/helpers/format-helper';
import { TMDBMediaType } from '../../../shared/types/media';
import { TMDBSearchType } from '../../../shared/types/search';
import {
  TMDBSearchSchema,
  TMDBIndexFilmArraySchema,
  TMDBIndexFilm,
  TMDBIndexShow,
  TMDBSearchResult,
  TMDBIndexShowArraySchema,
} from '../schemas/tmdb-index-media-schemas';
import { tmdbAPI } from '../util/config';
import { tmdbPaths } from '../util/url-helper';
import { tryFetchTMDBFilm } from './film-service';
import { tryFetchTMDBShow } from './show-service';

export interface TMDBFilmSearchData extends TMDBSearchResult {
  films: TMDBIndexFilm[];
}

export interface TMDBShowSearchData extends TMDBSearchResult {
  shows: TMDBIndexShow[];
}
//search by term from TMDB Api shows, films or both. page defaults to 1.
//results are parsed as films and shows so the controller can use them as well
//as the generic Result info (total pages, total results, etc)

export const fetchSearchFromTMDBAndParse = async (
  searchTerm: string,
  searchType: TMDBSearchType,
  pageToSearch: number | string
): Promise<
  [TMDBFilmSearchData | undefined, TMDBShowSearchData | undefined]
> => {
  const termIsNumber: boolean = isStringANumber(searchTerm);
  const isMulti = searchType === TMDBSearchType.Multi;
  const pageString: string = pageToSearch.toString();
  const isPageOne: boolean = ['1', '0'].includes(pageString);
  const potentialTmdbId: boolean = isPageOne && termIsNumber;
  const searchFilms = searchType === TMDBSearchType.Movie || isMulti;
  const searchShows = searchType === TMDBSearchType.TV || isMulti;

  console.log('Is this probably a tmdbid?', pageString, termIsNumber);
  const [filmResponse, showResponse, filmByTmdbId, showByTmdbId] =
    await Promise.all([
      searchFilms
        ? tmdbAPI.get<unknown>(tmdbPaths.search.films(searchTerm, pageString))
        : Promise.resolve(null),
      searchShows
        ? tmdbAPI.get<unknown>(tmdbPaths.search.shows(searchTerm, pageString))
        : Promise.resolve(null),
      //now, if term could be a tmdbId and this is page 1, we try to add it to the results
      searchFilms && potentialTmdbId
        ? tryFetchTMDBFilm(searchTerm)
        : Promise.resolve(null),
      searchShows && potentialTmdbId
        ? tryFetchTMDBShow(searchTerm)
        : Promise.resolve(null),
    ]);

  let filmData: TMDBFilmSearchData | undefined;
  let showData: TMDBShowSearchData | undefined;

  if (filmResponse?.data) {
    const parsedResult: TMDBSearchResult = TMDBSearchSchema.parse(
      filmResponse.data
    );
    const parsedFilms: TMDBIndexFilm[] = TMDBIndexFilmArraySchema.parse(
      parsedResult.results
    );
    filmData = { ...parsedResult, films: parsedFilms };

    //if we found a match by tmdbId, we convert it and inject it as first Film result.
    if (filmByTmdbId) {
      const filmAsIndexMedia: TMDBIndexFilm = {
        ...filmByTmdbId,
        media_type: TMDBMediaType.Film,
        release_date: filmByTmdbId.release_date ?? '',
      };
      filmData.films.unshift(filmAsIndexMedia);
      filmData.total_results += 1;
    }
  }

  if (showResponse?.data) {
    const parsedResult: TMDBSearchResult = TMDBSearchSchema.parse(
      showResponse.data
    );
    const parsedShows: TMDBIndexShow[] = TMDBIndexShowArraySchema.parse(
      parsedResult.results
    );
    showData = { ...parsedResult, shows: parsedShows };
    //if we found a match by tmdbId, we convert it and inject it as first Film result.
    if (showByTmdbId) {
      const showAsIndexMedia: TMDBIndexShow = {
        ...showByTmdbId,
        media_type: TMDBMediaType.Show,
        first_air_date: showByTmdbId.first_air_date ?? '',
      };
      showData.shows.unshift(showAsIndexMedia);
      showData.total_results += 1;
    }
  }

  return [filmData, showData];
};
