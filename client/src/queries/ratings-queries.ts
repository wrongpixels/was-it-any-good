import { useQuery } from '@tanstack/react-query';
import { getRatingByMediaId } from '../services/ratings-service';
import { CheckRating } from '../../../shared/types/models';

export const useRatingByMedia = ({ mediaId, mediaType }: CheckRating) =>
  useQuery({
    queryKey: ['rating', `${mediaType.toLocaleLowerCase()}-${mediaId}`],
    queryFn: () => getRatingByMediaId({ mediaId, mediaType }),

    enabled: !!mediaId && !!mediaType,
  });
