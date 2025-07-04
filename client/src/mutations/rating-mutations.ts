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
  addVoteToMedia,
  getMediaKey,
  getRatingKey,
  getTmdbMediaKey,
  removeVoteFromMedia,
} from '../utils/ratings-helper';
import {
  useMediaQueryManager,
  MediaQueryManager,
} from '../utils/media-query-manager';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vote'],
    mutationFn: (rating: CreateRating) => voteMedia(rating),
    onMutate: (rating: CreateRating) => {
      const queryManager: MediaQueryManager = useMediaQueryManager(
        queryClient,
        rating.mediaType,
        rating.mediaId
      );
      queryManager.setRating(rating);
      if (queryManager.media) {
        const updatedMedia: MediaResponse = addVoteToMedia(
          queryManager.media,
          rating.userScore,
          queryManager.rating?.userScore
        );
        queryManager.setMedia(updatedMedia);
      }
      return {
        previousRating: rating,
        queryKey: queryManager.ratingQueryKey,
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
        const updatedResponse: MediaResponse = removeVoteFromMedia(
          currentMediaData,
          userScore
        );
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
