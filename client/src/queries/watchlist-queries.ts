import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexMediaResults } from '../../../shared/types/models';
import { QUERY_KEY_WATCHLIST } from '../constants/query-key-constants';
import { getActiveUserWatchlist } from '../services/watchlist-service';

export const useActiveUserWatchlistQuery = (
  userId: number,
  query: string
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_WATCHLIST, `${userId}`],
    retry: false,
    queryFn: () => getActiveUserWatchlist(query),
  });
};
