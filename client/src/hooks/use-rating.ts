import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { CreateRating } from '../../../shared/types/models';
import {
  useVoteMutation,
  useUnvoteMutation,
} from '../mutations/rating-mutations';
import { useRatingByMedia } from '../queries/ratings-queries';
import { useAuth } from './use-auth';

export const useRating = (mediaId: number, mediaType: MediaType) => {
  const { session } = useAuth();
  const { data: userRating } = useRatingByMedia({
    mediaId,
    mediaType,
    userId: session?.userId,
  });
  const voteMutation = useVoteMutation();
  const unVoteMutation = useUnvoteMutation();

  const handleVote = (rating: UserVote, showId?: number): void => {
    const ratingData: CreateRating = {
      mediaId,
      mediaType,
      userScore: rating,
      showId,
    };
    voteMutation.mutate(ratingData);
  };

  const handleUnvote = (): void => {
    if (userRating) {
      unVoteMutation.mutate(userRating);
    }
  };

  return { userRating, handleVote, handleUnvote };
};
