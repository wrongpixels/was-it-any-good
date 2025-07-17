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
  CreateRatingResponse,
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

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vote'],
    mutationFn: (rating: CreateRating) => voteMedia(rating),
    onMutate: (rating: CreateRating) => {
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      if (!queryManager.media) {
        return;
      }

      if (queryManager.isSeason) {
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = addVoteToSeason(
            queryManager.seasonMedia,
            rating.userScore
          );
          console.log('mutating season');
          console.log(rating);
          queryManager.setSeason(updatedSeason);
        }
      } else {
        console.log(rating.userScore);
        const updatedMedia: MediaResponse = addVoteToMedia(
          queryManager.media,
          rating.userScore
        );
        queryManager.setMedia(updatedMedia);
      }
    },
    onError: (_err, _rating) => {},
    onSuccess: (ratingResponse: CreateRatingResponse) => {
      //the server returns the media's updated average rating and voteCount alongside the rating data
      //this avoids invalidating the entire media query as only voteCount and rating changed.
      const { ratingStats, ...ratingData } = ratingResponse;
      const rating: RatingData = ratingData;
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      if (!queryManager.media) {
        //if the cache is empty, we invalidate to refetch fresh data.
        console.log('Invalidation');
        console.log(rating);
        queryManager.invalidateMedia();
        return;
      }
      if (queryManager.isSeason) {
        console.log(ratingResponse);

        //we replace cached media's voteCount and rating with the server values
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = {
            ...queryManager.seasonMedia,
            ...ratingStats,
          };
          queryManager.setSeason(updatedSeason);
          console.log('success in season');
          console.log(ratingStats);
        }
      } else {
        const updatedMedia: MediaResponse = {
          ...queryManager.media,
          ...ratingStats,
        };
        queryManager.setMedia(updatedMedia);
        console.log(ratingStats);
      }
    },
  });
};
export const useUnvoteMutation = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: RatingData) => unvoteMedia(id),
    onMutate: (rating: RatingData) => {
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      if (!queryManager.media) {
        return;
      }
      if (queryManager.isSeason) {
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = removeVoteFromSeason(
            queryManager.seasonMedia
          );
          queryManager.setSeason(updatedSeason);
        }
      } else {
        const updatedMedia: MediaResponse = removeVoteFromMedia(
          queryManager.media
        );
        queryManager.setMedia(updatedMedia);
      }
    },
  });
};
