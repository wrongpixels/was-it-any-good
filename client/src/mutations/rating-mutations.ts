import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unvoteMedia, voteMedia } from '../services/ratings-service';
import { CreateRating, RatingData } from '../../../shared/types/models';
import { getRatingKey } from '../utils/ratings-helper';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vote'],
    mutationFn: (rating: CreateRating) => voteMedia(rating),
    onMutate: async (rating: CreateRating, tmdb: boolean = false) => {
      const queryKey = getRatingKey(rating.mediaType, rating.mediaId);
      await queryClient.cancelQueries({ queryKey });
      const previousRating = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, rating);

      const currentMediaData = queryClient.getQueryData([
        tmdb ? 'tmdbMedia' : 'media',
      ]);

      return {
        previousRating,
        queryKey,
      };
    },
    onError: (_err, _rating, context) => {
      if (context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousRating);
      }
    },
    onSuccess: (rating: RatingData) => {
      const queryKey = getRatingKey(rating.mediaType, rating.mediaId);
      queryClient.setQueryData(queryKey, rating);
    },
  });
};
export const useUnvoteMutation = () => {
  return useMutation({
    mutationFn: (ratingId: number) => unvoteMedia(ratingId),
    onSuccess: ({}) => {},
  });
};
