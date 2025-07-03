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
import { CreateRating } from '../../../../shared/types/models';
import { useRatingByMedia } from '../../queries/ratings-queries';
import {
  useUnvoteMutation,
  useVoteMutation,
} from '../../mutations/rating-mutations';

type ColorVariant = 'default' | 'hover' | 'selected' | 'delete';

interface StarListProps {
  readonly width: number;
  readonly justVoted: boolean;
  readonly defaultRating: number;
  readonly userRating?: UserVote;
}

interface StarIconProps {
  readonly width: number;
}

interface StarIconsProps {
  readonly season?: number;
  readonly starWidth?: number;
  readonly defaultRating?: number;
  readonly mediaType: MediaType;
  readonly mediaId: number;
}

const COLORS: Record<ColorVariant, string> = {
  default: 'text-[#6d90cf]',
  hover: 'text-green-600',
  selected: 'text-yellow-500',
  delete: 'text-red-500',
} as const;

export const StarIcon = ({ width }: StarIconProps): JSX.Element => (
  <svg
    width={width}
    height={width}
    viewBox="0 0 24 24"
    className="fill-current"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8532 4.13112C11.2884 3.12751 12.7117 3.12752 13.1469 4.13112L15.1266 8.69665L20.0805 9.16869C21.1695 9.27246 21.6093 10.626 20.7893 11.3501L17.059 14.6438L18.1408 19.501C18.3787 20.5688 17.2272 21.4053 16.2853 20.8492L12 18.3193L7.71482 20.8492C6.77284 21.4053 5.62141 20.5688 5.85923 19.501L6.94111 14.6438L3.21082 11.3501C2.39082 10.626 2.83063 9.27246 3.91959 9.16869L8.87345 8.69665L10.8532 4.13112Z"
    />
  </svg>
);

const StarIcons = ({
  season = 0,
  starWidth = 26,
  defaultRating = 0,
  mediaType,
  mediaId,
}: StarIconsProps): JSX.Element => {
  const { session } = useAuth();
  const { data: userRating } = useRatingByMedia({
    mediaId,
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
    };
    setJustVoted(true);
    voteMutation.mutate(ratingData);
    setTimeout(() => setJustVoted(false), 200);
  };

  const handleUnvote = () => {
    if (!userRating) {
      return;
    }
    unVoteMutation.mutate(userRating.id);
  };

  const calculateNewRating = (x: number, width: number): UserVote => {
    const paddingWidth: number = 25;
    const starsWidth: number = width - paddingWidth;
    const adjustedX: number = x - paddingWidth / 2;
    const rating: number = Math.round((adjustedX / starsWidth) * 10);
    if (rating <= 0) {
      if (userRating?.userScore === UserVote.None) {
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
    if (!session || session.expired || !session.userId) {
      notification.setNotification('You have to login to vote!');
      return;
    }
    if (
      hoverRating === UserVote.Unvote ||
      userRating?.userScore === hoverRating
    ) {
      if (userRating) {
        handleUnvote();
      }
    } else if (hoverRating) {
      notification.setNotification(
        `Voted ${mediaType}${mediaType === MediaType.Season && season !== 0 ? ` ${season}` : ''}\nwith a ${hoverRating}!`
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
      return isUnvoteAction ? COLORS.delete : COLORS.hover;
    }

    return userRating ? COLORS.selected : COLORS.default;
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
      const scales = [
        'scale-115',
        'scale-120',
        'scale-125',
        'scale-130',
        'scale-140',
      ];
      const delays = [
        'delay-0',
        'delay-20',
        'delay-30',
        'delay-50',
        'delay-75',
      ];
      const durations = [
        'duration-115',
        'duration-120',
        'duration-125',
        'duration-130',
        'duration-200',
      ];

      return `transition-all ${scales[i]} ${delays[i]} ${durations[i]} ${
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
