import { formatRatingDate } from '../../../../shared/helpers/format-helper';
import { RatingData } from '../../../../shared/types/models';
import {
  NO_RATINGS,
  DEF_MINI_STAR_WIDTH,
} from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import DisplayRating from './DisplayRating';

interface StarRatingIndexMediaProps {
  isVote?: boolean;
  rating: number | undefined;
  userRating?: RatingData;
}

//a component to draw with un-responsive rating stars the rating of and
//IndexMedia. The rating has to be provided already calculated.
//Defaults to 0 if undefined

const StarRatingIndexMedia = ({
  rating = 0,
  isVote,
  userRating,
}: StarRatingIndexMediaProps) => {
  return (
    <span className="flex justify-center items-center flex-col text-2xl font-bold text-gray-500">
      {rating > 0 ? (
        <div
          title={`WIAG Score: ${rating}${userRating ? `\nYour rating: ${userRating.userScore}` : ''} `}
          className="flex flex-row items-center gap-2.5"
        >
          <span className="cursor-help">{rating}</span>
          {userRating?.updatedAt && (
            <span
              title={`Voted ${formatRatingDate(userRating.updatedAt)}`}
              className={`shadow/20 mt-0.5 text-regular text-center align-middle font-semibold text-white rounded bg-starblue/70 w-6 ${styles.animations.zoomLessOnHover} border-2 border-sky-900/50`}
            >
              {userRating.userScore}
            </span>
          )}
        </div>
      ) : (
        <div className="text-sm font-normal text-gray-300 text-center pt-2 pb-1 italic">
          {NO_RATINGS}
        </div>
      )}
      <DisplayRating
        className="-mt-0.5"
        rating={rating}
        isVote={isVote || !!userRating}
        starWidth={DEF_MINI_STAR_WIDTH}
      />
    </span>
  );
};

export default StarRatingIndexMedia;
