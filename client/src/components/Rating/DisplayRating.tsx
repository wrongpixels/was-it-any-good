import StarList from './StarList';
import {
  DEF_STAR_WIDTH,
  RATING_COLORS,
} from '../../constants/ratings-constants';
import { JSX } from 'react';
import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface DisplayRatingProps extends OptClassNameProps {
  readonly rating: number;
  readonly starWidth?: number;
}

const DisplayRating = ({
  rating,
  starWidth = DEF_STAR_WIDTH,
  ...props
}: DisplayRatingProps): JSX.Element => {
  const widthPercentage: string = `${rating * 10}%`;

  return (
    <div className={`${mergeClassnames('flex', props.className)}`}>
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
