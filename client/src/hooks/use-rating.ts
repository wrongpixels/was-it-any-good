import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { CreateRating, RatingData } from '../../../shared/types/models';
import { useAnimation } from '../context/AnimationProvider';
import {
  useVoteMutation,
  useUnvoteMutation,
} from '../mutations/rating-mutations';

export const useRating = (
  mediaId: number,
  mediaType: MediaType,
  userRating: RatingData | null,
  onVote?: () => void
) => {
  const voteMutation = useVoteMutation();
  const unVoteMutation = useUnvoteMutation();
  const { playAnim } = useAnimation();

  const handleVote = (rating: UserVote, showId?: number): void => {
    const ratingData: CreateRating = {
      mediaId,
      mediaType,
      userScore: rating,
      showId,
    };
    voteMutation.mutate(ratingData);
    onVote?.();
    playAnim({
      key: `${mediaType}-score-${mediaId}`,
      animationClass: 'animate',
    });
    if (showId)
      playAnim({
        key: `${MediaType.Show}-score-${showId}`,
        animationClass: 'animate-d-ping',
      });
  };

  const handleUnvote = (showId?: number): void => {
    if (userRating) {
      unVoteMutation.mutate(userRating);
      onVote?.();
      playAnim({
        key: `${mediaType}-score-${mediaId}`,
        animationClass: 'animate-d-ping',
      });
      if (showId)
        playAnim({
          key: `${MediaType.Show}-score-${showId}`,
          animationClass: 'animate-d-ping',
        });
    }
  };

  return { handleVote, handleUnvote };
};
