import { useState, MouseEvent, JSX } from 'react';
import {
  useNotification,
  UseNotificationValues,
} from '../../hooks/use-notification';
import { MediaType } from '../../../../shared/types/media';
import { UserVote } from '../../../../shared/types/common';
import HoverMessage from '../notifications/HoverMessage';
import { numToVote } from '../../utils/ratings-helper';
import { useAuth } from '../../hooks/use-auth';
import { useRatingByMedia } from '../../queries/ratings-queries';
import {
  useUnvoteMutation,
  useVoteMutation,
} from '../../mutations/rating-mutations';
import StarIcon from './StarIcon';
import {
  DEF_STAR_PADDING,
  RATING_COLORS,
  RATING_DELAYS,
  RATING_DURATIONS,
  RATING_SCALES,
} from '../../constants/ratings-constants';
import {
  DEF_NOTIFICATION_DURATION,
  LOW_NOTIFICATION,
} from '../../constants/notification-constants';
import { CreateRating } from '../../../../shared/types/models';

interface StarListProps {
  readonly width: number;
  readonly justVoted: boolean;
  readonly defaultRating: number;
  readonly userRating?: UserVote;
}

interface StarIconsProps {
  readonly starWidth?: number;
  readonly defaultRating?: number;
  readonly mediaId: number;
  readonly mediaType: MediaType;
  readonly showId?: number;
}

const StarIcons = ({
  starWidth = 26,
  defaultRating = 0,
  mediaId,
  mediaType,
  showId,
}: StarIconsProps): JSX.Element => {
  const { session } = useAuth();
  const { data: userRating } = useRatingByMedia({
    mediaId: mediaType === MediaType.Season && showId ? showId : mediaId,
    mediaType,
    userId: session?.userId,
  });
  const voteMutation = useVoteMutation();
  const unVoteMutation = useUnvoteMutation();

  const notification: UseNotificationValues = useNotification();

  const [hoverRating, setHoverRating]: [
    UserVote,
    React.Dispatch<React.SetStateAction<UserVote>>,
  ] = useState<UserVote>(UserVote.None);
  const [isHovering, setIsHovering]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const [needToLeave, setNeedToLeave]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const [justVoted, setJustVoted]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const handleVote = (): void => {
    const ratingData: CreateRating = {
      mediaId,
      mediaType,
      userScore: hoverRating,
      showId,
    };
    setJustVoted(true);
    voteMutation.mutate(ratingData);
    setTimeout(() => setJustVoted(false), 200);
  };

  const handleUnvote = () => {
    if (!userRating) {
      return;
    }
    unVoteMutation.mutate(userRating);
  };

  const calculateNewRating = (x: number, width: number): UserVote => {
    const paddingWidth: number = DEF_STAR_PADDING;
    const starsWidth: number = width - paddingWidth;
    const adjustedX: number = x - paddingWidth / 2;
    const rating: number = Math.round((adjustedX / starsWidth) * 10);
    if (rating <= 0) {
      if (!userRating || userRating.userScore === UserVote.None) {
        return UserVote.One;
      }
      return UserVote.Unvote;
    }
    return numToVote(rating);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    const container: EventTarget & HTMLDivElement = e.currentTarget;
    const { left, width }: DOMRect = container.getBoundingClientRect();
    const x: number = e.clientX - left;
    const newRating: UserVote = calculateNewRating(x, width);
    if (needToLeave) {
      return;
    }
    setHoverRating(newRating);
    setIsHovering(true);
  };

  const handleClick = (): void => {
    if (needToLeave) {
      return;
    }
    if (!session || session.expired || !session.userId) {
      notification.setNotification(
        'You have to login to vote!',
        DEF_NOTIFICATION_DURATION,
        LOW_NOTIFICATION
      );
      return;
    }
    if (
      hoverRating === UserVote.Unvote ||
      userRating?.userScore === hoverRating
    ) {
      if (userRating) {
        notification.setNotification(
          `Unvoted ${mediaType}`,
          DEF_NOTIFICATION_DURATION,
          LOW_NOTIFICATION
        );
        handleUnvote();
      }
    } else if (hoverRating) {
      notification.setNotification(
        `Voted ${mediaType}\nwith a ${hoverRating}!`,
        DEF_NOTIFICATION_DURATION,
        LOW_NOTIFICATION
      );
      handleVote();
    }
    setIsHovering(false);
    setNeedToLeave(true);
  };

  const getStarColor = (): string => {
    if (isHovering) {
      const isUnvoteAction: boolean =
        hoverRating === UserVote.Unvote ||
        hoverRating === userRating?.userScore;
      return isUnvoteAction ? RATING_COLORS.delete : RATING_COLORS.hover;
    }

    return userRating ? RATING_COLORS.selected : RATING_COLORS.default;
  };
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
  const widthPercentage: string = `${displayRating.valueOf() * 10}%`;

  return (
    <div className="flex flex-col items-center mt-1">
      <div
        ref={notification.ref}
        className={`relative ${MediaType.Season ? 'h-6' : 'h-7'} cursor-pointer flex`}
        onMouseMove={handleMouseMove}
        onMouseLeave={(): void => {
          setHoverRating(UserVote.None);
          setIsHovering(false);
          setNeedToLeave(false);
        }}
        onClick={handleClick}
      >
        <div className="w-4" />
        <div className={`relative`}>
          <div className={'text-gray-300'}>
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
                width={starWidth}
                justVoted={justVoted}
                defaultRating={defaultRating}
                userRating={userRating?.userScore}
              />
            </div>
          </div>
        </div>

        <div className="w-4" />
      </div>
      <div>{notification.field}</div>
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

const StarList = ({
  width,
  justVoted,
  userRating = 0,
}: StarListProps): JSX.Element => {
  const getStarClassname = (i: number): string => {
    if (justVoted && i < userRating / 2) {
      return `transition-all ${RATING_SCALES[i]} ${RATING_DELAYS[i]} ${RATING_DURATIONS[i]} ${
        userRating ? 'text-yellow-400' : 'text-blue-400'
      }`;
    }
    return '';
  };

  return (
    <div
      className={`inline-flex whitespace-nowrap ${width === 26 ? 'gap-1' : ''}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={getStarClassname(i)}>
          <StarIcon width={width} />
        </span>
      ))}
    </div>
  );
};

export default StarIcons;
