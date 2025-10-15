import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSearch } from '../services/search-service';
import { IndexMediaResults } from '../../../shared/types/models';
import { QUERY_KEY_SEARCH } from '../constants/tanstack-key-constants';

export const useSearchQuery = (
  searchQuery: string,
  searchTerm: string | null
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_SEARCH, searchQuery],
    queryFn: () => getSearch(searchQuery),
    enabled: !!searchQuery && !!searchTerm,
    select: (data: IndexMediaResults) => {
      data.indexMedia = data.indexMedia.sort(
        (a, b) => b.popularity - a.popularity
      );
      return data;
    },
  });
};
