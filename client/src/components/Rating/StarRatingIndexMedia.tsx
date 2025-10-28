import { formatRatingDate } from '../../../../shared/helpers/format-helper';
import { RatingData } from '../../../../shared/types/models';
import { DEF_MINI_STAR_WIDTH } from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { CardRatingData, getCardRatingText } from '../../utils/ratings-helper';
import DisplayRating from './DisplayRating';

interface StarRatingIndexMediaProps {
  isVote?: boolean;
  rating: number | undefined;
  releaseDate: string | null;
  userRating?: RatingData;
}

//a component to draw with un-responsive rating stars the rating of and
//IndexMedia. The rating has to be provided already calculated.
//Defaults to 0 if undefined

const StarRatingIndexMedia = ({
  rating = 0,
  isVote,
  userRating,
  releaseDate,
}: StarRatingIndexMediaProps) => {
  const { hasRatingText, ...cardRatingData }: CardRatingData =
    getCardRatingText(releaseDate, rating, userRating);
  return (
    <span className="flex justify-center items-center flex-col text-2xl font-bold text-gray-500">
      {!hasRatingText ? (
        <div
          title={cardRatingData.ratingTitle}
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
        <div className="text-sm font-normal text-gray-400/80 text-center pt-2 pb-1 italic">
          {cardRatingData.ratingText}
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
