import { usePrefetchQuery, useQuery } from '@tanstack/react-query';
import { getRatingByMediaId } from '../services/ratings-service';
import { CheckRating } from '../../../shared/types/models';
import { getRatingKey } from '../utils/ratings-helper';
import { MediaType } from '../../../shared/types/media';

export const useRatingByMedia = ({ mediaId, mediaType, userId }: CheckRating) =>
  useQuery({
    queryKey: getRatingKey(mediaType, mediaId),
    queryFn: () => getRatingByMediaId({ mediaId, mediaType }),
    enabled: !!mediaId && !!mediaType && !!userId,
  });

export const usePrefetchRating = (
  mediaId: number | undefined = -1,
  mediaType: MediaType
) =>
  usePrefetchQuery({
    queryKey: getRatingKey(mediaType, mediaId),
    queryFn: () => getRatingByMediaId({ mediaId, mediaType }),
    retry: false,
  });
