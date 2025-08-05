import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IndexMediaResponse } from '../../../shared/types/models';
import { getTrending } from '../services/trending-service';

export const useTrendingQuery = (): UseQueryResult<
  IndexMediaResponse,
  Error
> => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    select: (data: IndexMediaResponse) => {
      data.indexMedia = data.indexMedia.sort(
        (a, b) => b.popularity - a.popularity
      );
      return data;
    },
  });
};
