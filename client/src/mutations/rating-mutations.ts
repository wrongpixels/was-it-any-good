import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { unvoteMedia, voteMedia } from '../services/ratings-service';
import { CreateRating, RatingData } from '../../../shared/types/models';

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: CreateRating) => voteMedia(rating),
    onSuccess: (rating: RatingData) => {
      queryClient.setQueryData(
        ['rating', `${rating.mediaType.toLowerCase()}-${rating.mediaId}`],
        rating
      );
    },
  });
};
export const useUnvoteMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (ratingId: number) => unvoteMedia(ratingId),
    onSuccess: ({}) => {},
  });
};
