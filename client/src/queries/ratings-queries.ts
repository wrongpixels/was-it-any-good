import { useQuery } from '@tanstack/react-query';
import { getRatingByMediaId } from '../services/ratings-service';

export const useRatingByMedia = (mediaId: number, userId: number) =>
  useQuery({
    queryKey: ['rating', `${mediaId}-${userId}`],
    queryFn: () => getRatingByMediaId(mediaId),
    enabled: !!mediaId && !!userId,
  });
