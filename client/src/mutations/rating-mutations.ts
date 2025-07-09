import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { unvoteMedia, voteMedia } from '../services/ratings-service';
import {
  CreateRatingMutation,
  MediaResponse,
  RatingData,
  RatingResponse,
  RemoveRatingMutation,
  SeasonResponse,
} from '../../../shared/types/models';
import {
  addVoteToMedia,
  addVoteToSeason,
  removeVoteFromMedia,
  removeVoteFromSeason,
} from '../utils/ratings-helper';
import {
  MediaQueryManager,
  createRatingQueryManager,
} from '../utils/media-query-manager';
import { MediaType } from '../../../shared/types/media';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vote'],
    mutationFn: (rating: CreateRatingMutation) =>
      voteMedia({
        userScore: rating.userScore,
        mediaType: rating.mediaType,
        mediaId:
          rating.mediaType === MediaType.Season && rating.seasonId
            ? rating.seasonId
            : rating.mediaId,
      }),
    onMutate: (rating: CreateRatingMutation) => {
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      queryManager.setRating(rating);

      if (!queryManager.media) {
        return;
      }

      if (queryManager.isSeason) {
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = addVoteToSeason(
            queryManager.seasonMedia,
            rating.userScore,
            queryManager.rating?.userScore
          );
          console.log(updatedSeason);
          queryManager.setSeason(updatedSeason);
        }
      } else {
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
    onSuccess: (ratingResponse: RatingResponse) => {
      //the server returns the media's updated average rating and voteCount alongside the rating data
      //this avoids invalidating the entire media query as only voteCount and rating changed.

      const { ratingStats, ...ratingData } = ratingResponse;
      const rating: RatingData = ratingData;
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      queryManager.setRating(rating);

      if (!queryManager.media) {
        //if the cache is empty, we invalidate to refetch fresh data.
        queryManager.invalidateMedia();
        return;
      }
      if (queryManager.isSeason) {
        //we replace cached media's voteCount and rating with the server values
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = {
            ...queryManager.seasonMedia,
            ...ratingStats,
          };
          queryManager.setSeason(updatedSeason);
        }
      } else {
        const updatedMedia: MediaResponse = {
          ...queryManager.media,
          ...ratingStats,
        };
        queryManager.setMedia(updatedMedia);
      }
    },
  });
};
export const useUnvoteMutation = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: RemoveRatingMutation) => unvoteMedia(id),
    onMutate: (rating: RemoveRatingMutation) => {
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      queryManager.setRating(null);

      if (!queryManager.media || !queryManager.rating) {
        return;
      }
      if (queryManager.isSeason) {
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = removeVoteFromSeason(
            queryManager.seasonMedia,
            queryManager.rating.userScore
          );
          console.log(updatedSeason);
          queryManager.setSeason(updatedSeason);
        }
      } else {
        const updatedMedia: MediaResponse = removeVoteFromMedia(
          queryManager.media,
          queryManager.rating.userScore
        );
        queryManager.setMedia(updatedMedia);
      }
    },
  });
};
