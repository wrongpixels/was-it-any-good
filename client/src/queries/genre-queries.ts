import {
  useQueries,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { getGenreById } from '../services/genre-service';
import { GenreResponse } from '../../../shared/types/models';
import { combineQueryResults } from '../utils/query-helper';
import { QUERY_KEY_GENRE } from '../constants/query-key-constants';

//we need to know our genre names by id in the Browse Page before accessing our results and
//and also when having no results at all. TansTack takes care of individually caching them,
//so out "bulk" option simply calls the individual query multiple times to make things easier.

const genreQueryOptions = (
  genreId: number | string
): UseQueryOptions<GenreResponse, Error> => ({
  queryKey: [QUERY_KEY_GENRE, genreId],
  queryFn: () => getGenreById(genreId),
  enabled: !!genreId,
});

export const useGenreQuery = (
  genreId: number
): UseQueryResult<GenreResponse, Error> => useQuery(genreQueryOptions(genreId));

export const useGenresQuery = (genreIds: number[] | string[]) =>
  useQueries({
    queries: genreIds.map((id: number | string) => genreQueryOptions(id)),
    combine: (results) => combineQueryResults<GenreResponse>(results),
  });
