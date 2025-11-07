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
  const { mediaType, userRating = null } = media;
  const showId: number | undefined =
    mediaType === MediaType.Season ? media.showId : undefined;

  const { handleVote, handleUnvote } = useRatingMutations(media, userRating);
  const [hoverScore, setHoverScore] = useState<UserVote>(UserVote.None);
  const [status, setStatus] = useState<InteractionStatus>('idle');
  const [justVoted, setJustVoted] = useState(false);
  const { session } = useAuth();
  const { playAnim } = useAnimEngine();

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

  const handleVoteAnimation = useCallback(() => {
    setJustVoted(true);
    setTimeout(() => setJustVoted(false), 400);
  }, []);

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
  );

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
        handleUnvote();
        handleVoteAnimation();
      }
    } else if (hoverScore) {
      handleVote(hoverScore);
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
  return useMemo(
    () => ({
      state,
      handlers,
      display,
    }),
    [state, handlers, display]
  );
};
