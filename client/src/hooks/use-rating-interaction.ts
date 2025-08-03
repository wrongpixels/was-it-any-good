import { useState, useCallback, useMemo } from 'react'; // Import useCallback and useMemo
import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { PADDING_ADJUSTER } from '../constants/ratings-constants';
import { numToVote } from '../utils/ratings-helper';
import { useAuth } from './use-auth';
import { MediaResponse, SeasonResponse } from '../../../shared/types/models';
import { useRatingMutations } from './use-rating-mutations';
import { getRatingDisplayValues } from '../utils/rating-display-values';
import { useAnimEngine } from '../context/AnimationProvider';

type InteractionStatus = 'idle' | 'hovering' | 'locked';

export const useRatingInteractions = (
  media: MediaResponse | SeasonResponse,
  starWidth: number,
  sendPosterNotification: (message: string) => void,
  defaultRating: number
) => {
  const { id: mediaId, mediaType, userRating = null } = media;
  const showId: number | undefined =
    mediaType === MediaType.Season ? media.showId : undefined;

  const { handleVote, handleUnvote } = useRatingMutations(
    mediaId,
    mediaType,
    userRating
  );
  const [hoverScore, setHoverScore] = useState<UserVote>(UserVote.None);
  const [status, setStatus] = useState<InteractionStatus>('idle');
  const [justVoted, setJustVoted] = useState(false);
  const { session } = useAuth();
  const { playAnim } = useAnimEngine();

  // This function is a pure calculation and isn't returned, so it doesn't
  // strictly need useCallback. It's fine as is.
  const calculateNewRating = (x: number, width: number): UserVote => {
    const starsWidth: number = starWidth * 5;
    const paddingWidth: number = width - starsWidth;
    const adjustedX: number = x + PADDING_ADJUSTER - paddingWidth / 2;
    const rating: number = Math.round((adjustedX / starsWidth) * 10);

    if (rating <= 0) {
      return userRating?.userScore !== UserVote.None
        ? UserVote.Unvote
        : UserVote.One;
    }
    return numToVote(rating);
  };

  // This is an internal helper, but since it's used by a memoized callback (handleClick),
  // it's good practice to memoize it as well to keep dependencies stable.
  const handleVoteAnimation = useCallback(() => {
    setJustVoted(true);
    setTimeout(() => setJustVoted(false), 400);
  }, []); // No dependencies from the render scope

  // --- OPTIMIZATION 1: Memoize all handler functions ---
  // This ensures that the `handlers` object we return is stable.

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (status === 'locked') {
        return;
      }
      const container: EventTarget & HTMLDivElement = e.currentTarget;
      const { left, width }: DOMRect = container.getBoundingClientRect();
      const x: number = e.clientX - left;
      const newRating: UserVote = calculateNewRating(x, width);
      setHoverScore(newRating);
      setStatus('hovering');
    },
    [status, starWidth, userRating]
  ); // Add all dependencies the function uses

  const handleClick = useCallback((): void => {
    if (status === 'locked') {
      return;
    }
    if (!session || session.expired || !session.userId) {
      sendPosterNotification('You have to login to vote!');
      playAnim({
        animKey: `${mediaType}-stars-${media.id}`,
        animationClass: 'animate-shake',
      });
      return;
    }
    if (
      hoverScore === UserVote.Unvote ||
      userRating?.userScore === hoverScore
    ) {
      if (userRating) {
        sendPosterNotification(`Unvoted ${mediaType}`);
        handleUnvote(showId);
        handleVoteAnimation();
      }
    } else if (hoverScore) {
      handleVote(hoverScore, showId);
      handleVoteAnimation();
    }
    setStatus('locked');
  }, [
    status,
    session,
    hoverScore,
    userRating,
    mediaType,
    showId,
    sendPosterNotification,
    playAnim,
    handleUnvote,
    handleVote,
    handleVoteAnimation,
  ]);

  const handleMouseLeave = useCallback((): void => {
    setHoverScore(UserVote.None);
    setStatus('idle');
  }, []);

  // --- OPTIMIZATION 2: Memoize the created objects ---
  // This ensures that if the inputs to these objects don't change, the objects
  // themselves are not recreated.

  const state = useMemo(
    () => ({
      hoverRating: hoverScore,
      isHovering: status === 'hovering',
      isLocked: status === 'locked',
      justVoted,
    }),
    [hoverScore, status, justVoted]
  );

  const handlers = useMemo(
    () => ({
      handleMouseMove,
      handleClick,
      handleMouseLeave,
    }),
    [handleMouseMove, handleClick, handleMouseLeave]
  );

  const display = useMemo(
    () =>
      getRatingDisplayValues({
        hoverScore,
        currentScore: userRating?.userScore,
        defaultRating,
        isHovering: status === 'hovering',
      }),
    [hoverScore, userRating, defaultRating, status]
  );

  // --- OPTIMIZATION 3: Memoize the final return value ---
  // This is the most important step. It guarantees that the hook's consumer
  // will only re-render when one of the memoized objects actually changes.
  return useMemo(
    () => ({
      state,
      handlers,
      display,
    }),
    [state, handlers, display]
  );
};
