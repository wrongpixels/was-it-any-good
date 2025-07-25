import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSearch } from '../services/search-service';
import { IndexMediaResponse } from '../../../shared/types/models';

export const useSearchQuery = (
  searchQuery: string,
  searchTerm: string | null
): UseQueryResult<IndexMediaResponse, Error> => {
  return useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => getSearch(searchQuery),
    enabled: !!searchQuery && !!searchTerm,
  });
};
