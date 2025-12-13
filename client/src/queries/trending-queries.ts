import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexMediaResults } from '../../../shared/types/models';
import { getTrending } from '../services/trending-service';
import { QUERY_KEY_TRENDING } from '../constants/query-key-constants';
import { DEF_API_WAIT_RETRY } from '../../../shared/constants/timeout-constants';

export const useTrendingQuery = (
  page: number = 1
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_TRENDING, page],
    refetchOnMount: 'always',
    retry: true,
    retryDelay: DEF_API_WAIT_RETRY,
    staleTime: 0,
    queryFn: () => getTrending(page),
    select: (data: IndexMediaResults) => {
      data.indexMedia = data.indexMedia.sort(
        (a, b) => b.popularity - a.popularity
      );
      return data;
    },
  });
};
