import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexMediaResults } from '../../../shared/types/models';
import { getTrending } from '../services/trending-service';

export const useTrendingQuery = (
  page: number = 1
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: ['trending', page],
    refetchOnMount: 'always',
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
