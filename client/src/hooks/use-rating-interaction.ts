import { useState } from 'react';
import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { PADDING_ADJUSTER } from '../constants/ratings-constants';
import { numToVote } from '../utils/ratings-helper';
import { useAuth } from './use-auth';
import { MediaResponse, SeasonResponse } from '../../../shared/types/models';
import { useRatingMutations } from './use-rating-mutations';
import { getRatingDisplayValues } from '../utils/rating-display-values';

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

  const handleVoteAnimation = () => {
    setJustVoted(true);
    setTimeout(() => setJustVoted(false), 400);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const container: EventTarget & HTMLDivElement = e.currentTarget;
    const { left, width }: DOMRect = container.getBoundingClientRect();
    const x: number = e.clientX - left;
    const newRating: UserVote = calculateNewRating(x, width);
    if (status === 'locked') {
      return;
    }
    setHoverScore(newRating);
    setStatus('hovering');
  };

  const handleClick = (): void => {
    if (status === 'locked') {
      return;
    }
    if (!session || session.expired || !session.userId) {
      sendPosterNotification('You have to login to vote!');
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
  };
  console.log(status);

  const handleMouseLeave = (): void => {
    setHoverScore(UserVote.None);
    setStatus('idle');
  };

  return {
    state: {
      hoverRating: hoverScore,
      isHovering: status === 'hovering',
      isLocked: status === 'locked',
      justVoted,
    },
    handlers: {
      handleMouseMove,
      handleClick,
      handleMouseLeave,
    },
    display: getRatingDisplayValues({
      hoverScore,
      currentScore: userRating?.userScore,
      defaultRating,
      isHovering: status === 'hovering',
    }),
  };
};
