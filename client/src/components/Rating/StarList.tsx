import StarIcon from './StarIcon';
import {
  RATING_DELAYS,
  RATING_DURATIONS,
  RATING_SCALES,
} from '../../constants/ratings-constants';
import { UserVote } from '../../../../shared/types/common';
import { JSX } from 'react';

interface StarListProps {
  readonly width: number;
  readonly justVoted: boolean;
  readonly defaultRating: number;
  readonly userRating?: UserVote;
}

const StarList = ({
  width,
  justVoted,
  userRating = 0,
}: StarListProps): JSX.Element => {
  const getStarClassname = (i: number): string => {
    if (justVoted && i < userRating / 2) {
      return `animate-ping [animation-iteration-count:1] transition-all ${RATING_DELAYS[i]} ${RATING_DURATIONS[i]}`;
    }
    return '';
  };

  return (
    <div className={`inline-flex whitespace-nowrap`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={getStarClassname(i)}>
          <StarIcon width={width} />
        </span>
      ))}
    </div>
  );
};

export default StarList;
