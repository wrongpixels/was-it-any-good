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
      //we do an optimistic update calculating what the new average should be
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      if (!queryManager.media) {
        return;
      }
      //we update the values directly in the queryClient cache
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
      //the server returns the new userRating data with updated media average rating and voteCount
      //Instead of invalidating the entire media query, que replace the fields in the cache
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

        //we replace the optimistic data onMutate with the actual server values
        if (queryManager.seasonMedia) {
          const updatedSeason: SeasonResponse = {
            ...queryManager.seasonMedia,
            ...ratingStats,
            userRating: rating,
          };
          queryManager.setSeason(updatedSeason);
          console.log('success in season');
          console.log(ratingStats);
        }
      } else {
        const updatedMedia: MediaResponse = {
          ...queryManager.media,
          ...ratingStats,
          userRating: rating,
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
