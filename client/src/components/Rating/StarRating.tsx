import HoverMessage from '../notifications/HoverMessage';
import { MediaType } from '../../../../shared/types/media';
import { UserVote } from '../../../../shared/types/common';
import StarList from './StarList';
import {
  DEF_STAR_WIDTH,
  RATING_COLORS,
} from '../../constants/ratings-constants';
import { JSX } from 'react';
import { useRating } from '../../hooks/use-rating';
import { useRatingInteraction } from '../../hooks/use-rating-interaction';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';

interface StarRatingProps {
  readonly starWidth?: number;
  readonly defaultRating?: number;
  readonly media: MediaResponse | SeasonResponse;
  readonly showId?: number;
}

const StarRating = ({
  starWidth = DEF_STAR_WIDTH,
  defaultRating = 0,
  media,
  showId,
}: StarRatingProps): JSX.Element => {
  const { mediaType, userRating = null, id: mediaId } = media;
  const { handleVote, handleUnvote } = useRating(
    mediaId,
    mediaType,
    userRating
  );
  const {
    hoverRating,
    isHovering,
    justVoted,
    needToLeave,
    handleMouseMove,
    handleClick,
    handleMouseLeave,
    notification,
  } = useRatingInteraction(
    userRating?.userScore,
    (rating) => handleVote(rating, showId),
    () => handleUnvote(showId),
    mediaType,
    starWidth
  );

  const getStarColor = (): string => {
    if (isHovering) {
      const isUnvoteAction: boolean =
        hoverRating === UserVote.Unvote ||
        hoverRating === userRating?.userScore;
      return isUnvoteAction ? RATING_COLORS.delete : RATING_COLORS.hover;
    }
    return userRating ? RATING_COLORS.selected : RATING_COLORS.default;
  };

  const getVoteStarColor = (): string =>
    userRating?.userScore ? RATING_COLORS.selected : RATING_COLORS.delete;

  const calculateDisplayRating = (): UserVote => {
    if (!isHovering) {
      return userRating && userRating.userScore !== UserVote.None
        ? userRating.userScore
        : defaultRating;
    }
    if (
      userRating &&
      userRating.userScore !== UserVote.None &&
      hoverRating === UserVote.Unvote
    ) {
      return userRating.userScore;
    }
    return hoverRating !== UserVote.None ? hoverRating : 1;
  };

  const displayRating: UserVote = calculateDisplayRating();
  const widthPercentage: string = `${displayRating * 10}%`;

  return (
    <div className="flex flex-col items-center mt-1">
      <div
        className={`relative ${mediaType === MediaType.Season ? 'h-6' : 'h-7'} cursor-pointer flex`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="w-4" />
        <div className="relative">
          <div className="text-gray-300" ref={notification.anchorRef}>
            <StarList
              width={starWidth}
              justVoted={false}
              defaultRating={defaultRating}
              userRating={userRating?.userScore}
            />
          </div>
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: widthPercentage }}
          >
            <div className={getStarColor()}>
              <StarList
                interactive={!needToLeave}
                width={starWidth}
                justVoted={false}
                defaultRating={defaultRating}
                userRating={userRating?.userScore}
              />
            </div>
            {justVoted && (
              <div
                className={`absolute top-0 left-0 overflow-hidden ${getVoteStarColor()}`}
              >
                <StarList
                  width={starWidth}
                  justVoted={true}
                  defaultRating={defaultRating}
                  userRating={userRating?.userScore || defaultRating}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-4" />
      </div>
      {isHovering && (
        <HoverMessage
          message={getHoverMessage(
            isHovering,
            hoverRating,
            userRating?.userScore
          )}
        />
      )}
    </div>
  );
};

const getHoverMessage = (
  isHovering: boolean,
  hoverRating: UserVote,
  userRating: UserVote = 0
): string => {
  if (isHovering && hoverRating !== UserVote.None) {
    if (
      userRating !== UserVote.None &&
      (userRating === hoverRating || hoverRating === UserVote.Unvote)
    ) {
      return 'Unvote';
    }
    return hoverRating.toString();
  }
  return '';
};

export default StarRating;
