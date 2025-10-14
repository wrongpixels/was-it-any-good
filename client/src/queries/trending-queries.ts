import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexMediaResults } from '../../../shared/types/models';
import { getTrending } from '../services/trending-service';

export const useTrendingQuery = (
  page: number = 1
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: ['trending', page],
    queryFn: getTrending,
    select: (data: IndexMediaResults) => {
      data.indexMedia = data.indexMedia.sort(
        (a, b) => b.popularity - a.popularity
      );
      return data;
    },
  });
};
