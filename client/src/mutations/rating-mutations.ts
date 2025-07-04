import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { unvoteMedia, voteMedia } from '../services/ratings-service';
import {
  CreateRating,
  MediaResponse,
  RatingData,
} from '../../../shared/types/models';
import {
  getMediaKey,
  getRatingKey,
  getTmdbMediaKey,
  recalculateRating,
} from '../utils/ratings-helper';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vote'],
    mutationFn: (rating: CreateRating) => voteMedia(rating),
    onMutate: async (rating: CreateRating) => {
      const queryKey: string[] = getRatingKey(rating.mediaType, rating.mediaId);
      const mediaQueryKey: string[] = getMediaKey(
        rating.mediaType,
        rating.mediaId
      );
      await queryClient.cancelQueries({ queryKey });
      const previousRating: RatingData | undefined =
        queryClient.getQueryData(queryKey);
      const currentMediaData: MediaResponse | undefined =
        queryClient.getQueryData(mediaQueryKey);

      queryClient.setQueryData(queryKey, rating);
      if (currentMediaData) {
        const tmdbMediaQueryKey: string[] = getTmdbMediaKey(
          rating.mediaType,
          currentMediaData.tmdbId
        );
        const updatedResponse: MediaResponse = {
          ...currentMediaData,
          ...recalculateRating(
            rating.userScore,
            currentMediaData.rating,
            currentMediaData.voteCount,
            previousRating?.userScore
          ),
        };
        queryClient.setQueryData<MediaResponse>(mediaQueryKey, {
          ...updatedResponse,
        });
        queryClient.setQueryData<MediaResponse>(tmdbMediaQueryKey, {
          ...updatedResponse,
        });
      }
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
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: RatingData) => unvoteMedia(id),
    onMutate: ({ userScore, mediaId, mediaType }: RatingData) => {
      const queryKey: string[] = getRatingKey(mediaType, mediaId);
      queryClient.setQueryData(queryKey, null);
      const mediaQueryKey: string[] = getMediaKey(mediaType, mediaId);
      const currentMediaData: MediaResponse | undefined =
        queryClient.getQueryData(mediaQueryKey);
      if (currentMediaData) {
        const tmdbMediaQueryKey: string[] = getTmdbMediaKey(
          mediaType,
          currentMediaData.tmdbId
        );
        const updatedResponse: MediaResponse = {
          ...currentMediaData,
          ...recalculateRating(
            0,
            currentMediaData.rating,
            currentMediaData.voteCount,
            userScore
          ),
        };
        queryClient.setQueryData<MediaResponse>(mediaQueryKey, {
          ...updatedResponse,
        });
        queryClient.setQueryData<MediaResponse>(tmdbMediaQueryKey, {
          ...updatedResponse,
        });
      }
    },
  });
};
