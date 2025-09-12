import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import {
  CreateRating,
  MediaResponse,
  RatingData,
  SeasonResponse,
} from '../../../shared/types/models';
import { useAnimEngine } from '../context/AnimationProvider';
import {
  useVoteMutation,
  useUnvoteMutation,
} from '../mutations/rating-mutations';

export const useRatingMutations = (
  media: MediaResponse | SeasonResponse,
  userRating: RatingData | null,
  onVote?: () => void
) => {
  const voteMutation = useVoteMutation();
  const unVoteMutation = useUnvoteMutation();
  const { playAnim } = useAnimEngine();

  const handleVote = (rating: UserVote, showId?: number): void => {
    const ratingData: CreateRating = {
      indexId: media.indexId,
      mediaId: media.id,
      mediaType: media.mediaType,
      userScore: rating,
      showId,
    };
    voteMutation.mutate(ratingData);
    onVote?.();
    playAnim({
      animKey: `${media.mediaType}-score-${media.id}`,
      animationClass: 'animate-bounce-once',
    });
    if (showId)
      playAnim({
        animKey: `${MediaType.Show}-score-${showId}`,
        animationClass: 'animate-d-ping',
      });
  };

  const handleUnvote = (showId?: number): void => {
    if (userRating) {
      unVoteMutation.mutate(userRating);
      onVote?.();
      playAnim({
        animKey: `${media.mediaType}-score-${media.id}`,
        animationClass: 'animate-d-ping',
      });
      if (showId)
        playAnim({
          animKey: `${MediaType.Show}-score-${showId}`,
          animationClass: 'animate-d-ping',
        });
    }
  };

  return { handleVote, handleUnvote };
};
