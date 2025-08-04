import { UserVote } from '../../../shared/types/common';
import { RATING_COLORS } from '../constants/ratings-constants';

interface RatingDisplayValues {
  starsColor: string;
  votingStarsColor: string;
  scoreToDisplay: UserVote;
  starsFillPercentage: string;
  hoverMessage: string;
}

interface RatingDisplayPros {
  hoverScore: UserVote;
  currentScore: UserVote | undefined;
  defaultRating: number;
  isHovering: boolean;
}

export const getRatingDisplayValues = ({
  hoverScore,
  currentScore,
  defaultRating,
  isHovering,
}: RatingDisplayPros): RatingDisplayValues => {
  const getStarColor = (): string => {
    if (isHovering) {
      const isUnvoteAction: boolean =
        currentScore !== undefined &&
        (hoverScore === UserVote.Unvote || hoverScore === currentScore);
      return isUnvoteAction ? RATING_COLORS.delete : RATING_COLORS.hover;
    }
    return currentScore ? RATING_COLORS.selected : RATING_COLORS.default;
  };

  const getVoteStarColor = (): string =>
    currentScore ? RATING_COLORS.selected : RATING_COLORS.delete;

  const calculateDisplayRating = (): UserVote => {
    if (!isHovering) {
      return currentScore !== undefined && currentScore !== UserVote.None
        ? currentScore
        : defaultRating;
    }
    if (
      currentScore !== undefined &&
      currentScore !== UserVote.None &&
      hoverScore === UserVote.Unvote
    ) {
      return currentScore;
    }
    return hoverScore !== UserVote.None ? hoverScore : 1;
  };

  const getHoverMessage = (): string => {
    if (isHovering && hoverScore !== UserVote.None) {
      if (
        currentScore !== UserVote.None &&
        (currentScore === hoverScore || hoverScore === UserVote.Unvote)
      ) {
        if (currentScore !== undefined) {
          return 'Unvote';
        }
        return UserVote.One.toString();
      }
      return hoverScore.toString();
    }
    return '';
  };

  const scoreToDisplay: UserVote = calculateDisplayRating();
  return {
    starsColor: getStarColor(),
    votingStarsColor: getVoteStarColor(),
    scoreToDisplay,
    starsFillPercentage: `${scoreToDisplay * 10}%`,
    hoverMessage: getHoverMessage(),
  };
};
