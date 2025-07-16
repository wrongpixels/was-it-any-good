import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { CreateRating, RatingData } from '../../../shared/types/models';
import {
  useVoteMutation,
  useUnvoteMutation,
} from '../mutations/rating-mutations';

export const useRating = (
  mediaId: number,
  mediaType: MediaType,
  userRating: RatingData | null
) => {
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

  return { handleVote, handleUnvote };
};
