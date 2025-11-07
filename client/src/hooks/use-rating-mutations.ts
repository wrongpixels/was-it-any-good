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
import { useWatchlistMutation } from '../mutations/watchlist-mutations';

export const useRatingMutations = (
  media: MediaResponse | SeasonResponse,
  userRating: RatingData | null,
  onVote?: () => void
) => {
  //if the media is in user's watchlist, we try to remove it

  const removeFromWatchlist: boolean = !!media.userWatchlist?.userList?.userId;
  const voteMutation = useVoteMutation(removeFromWatchlist);
  const unVoteMutation = useUnvoteMutation();
  const watchlistMutation = useWatchlistMutation();
  const { playAnim } = useAnimEngine();
  const showId: number | undefined =
    media.mediaType === MediaType.Season ? media.showId : undefined;

  const handleVote = (rating: UserVote, userId?: number): void => {
    const ratingData: CreateRating = {
      indexId: media.indexId,
      mediaId: media.id,
      mediaType: media.mediaType,
      userScore: rating,
      showId,
    };

    voteMutation.mutate(ratingData);
    //we only call the mutation for the watchlist removal if
    // the provided userId matches the owner of the list.
    if (
      userId &&
      removeFromWatchlist &&
      media.userWatchlist?.userList?.userId === userId
    ) {
      watchlistMutation.mutate({
        inList: true,
        userId: userId,
        indexId: media.indexId,
      });
    }
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

  const handleUnvote = (): void => {
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
