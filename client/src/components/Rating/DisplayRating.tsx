import StarList from './StarList';
import {
  DEF_STAR_WIDTH,
  RATING_COLORS,
} from '../../constants/ratings-constants';
import { JSX } from 'react';

interface DisplayRatingProps {
  readonly rating: number;
  readonly starWidth?: number;
}

const DisplayRating = ({
  rating,
  starWidth = DEF_STAR_WIDTH,
}: DisplayRatingProps): JSX.Element => {
  const widthPercentage: string = `${rating * 10}%`;

  return (
    <div className="flex">
      <div className="relative">
        <div className="text-gray-300">
          <StarList
            width={starWidth}
            justVoted={false}
            defaultRating={rating}
          />
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: widthPercentage }}
        >
          <div className={RATING_COLORS.default}>
            <StarList
              width={starWidth}
              justVoted={false}
              defaultRating={rating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayRating;
