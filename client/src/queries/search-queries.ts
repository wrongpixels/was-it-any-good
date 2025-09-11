import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSearch } from '../services/search-service';
import { IndexMediaResults } from '../../../shared/types/models';

export const useSearchQuery = (
  searchQuery: string,
  searchTerm: string | null
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: ['search', searchQuery],
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
