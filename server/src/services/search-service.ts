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
  const isMulti = searchType === TMDBSearchType.Multi;
  const searchFilms = searchType === TMDBSearchType.Movie || isMulti;
  const searchShows = searchType === TMDBSearchType.TV || isMulti;

  const [filmResponse, showResponse] = await Promise.all([
    searchFilms
      ? tmdbAPI.get<unknown>(
          tmdbPaths.search.films(searchTerm, pageToSearch.toString())
        )
      : Promise.resolve(null),
    searchShows
      ? tmdbAPI.get<unknown>(
          tmdbPaths.search.shows(searchTerm, pageToSearch.toString())
        )
      : Promise.resolve(null),
  ]);

  let filmData: TMDBFilmSearchData | undefined;
  let showData: TMDBShowSearchData | undefined;

  if (filmResponse?.data) {
    const parsedResult = TMDBSearchSchema.parse(filmResponse.data);
    const parsedFilms = TMDBIndexFilmArraySchema.parse(parsedResult.results);
    filmData = { ...parsedResult, films: parsedFilms };
  }

  if (showResponse?.data) {
    const parsedResult = TMDBSearchSchema.parse(showResponse.data);
    const parsedShows = TMDBIndexShowArraySchema.parse(parsedResult.results);
    showData = { ...parsedResult, shows: parsedShows };
  }

  return [filmData, showData];
};
