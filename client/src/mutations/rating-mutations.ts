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
import {
  MUTATION_KEY_VOTE,
  QUERY_KEY_TRENDING,
} from '../constants/query-key-constants';

export const useVoteMutation = (removeFromWatchlist?: boolean) => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEY_VOTE],
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
            rating.userScore,
            removeFromWatchlist
          );
          console.log('mutating season');
          console.log(rating);
          queryManager.setSeason(updatedSeason);
        }
      } else {
        console.log(rating.userScore);
        const updatedMedia: MediaResponse = addVoteToMedia(
          queryManager.media,
          rating.userScore,
          removeFromWatchlist
        );

        queryManager.setMedia(updatedMedia);
      }
    },
    onError: (_err, _rating) => {},
    onSuccess: (ratingResponse: CreateRatingResponse) => {
      //we invalidate the cache of HomePage
      queryClient.removeQueries({
        queryKey: [QUERY_KEY_TRENDING],
        exact: false,
      });
      //the server returns the new userRating data with updated media average rating and voteCount
      //Instead of invalidating the entire media query, que replace the fields in the cache
      const { ratingStats, ...ratingData } = ratingResponse;
      const rating: RatingData = ratingData;
      const queryManager: MediaQueryManager = createRatingQueryManager({
        queryClient,
        rating,
      });
      if (!queryManager.media) {
        //if the cache is empty, we refetch fresh data.
        console.log('Invalidation');
        console.log(rating);
        queryManager.refetchMedia();
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
        console.log(ratingStats, updatedMedia.userWatchlist);
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
    onSuccess: () => {
      //we REMOVE HomePage cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEY_TRENDING],
        exact: false,
      });
    },
  });
};
