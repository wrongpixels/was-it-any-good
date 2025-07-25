import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSearch } from '../services/search-service';
import { IndexMediaData } from '../../../shared/types/models';

export const useSearchQuery = (
  searchQuery: string
): UseQueryResult<IndexMediaData[], Error> => {
  return useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => getSearch(searchQuery),
    enabled: !!searchQuery,
  });
};
