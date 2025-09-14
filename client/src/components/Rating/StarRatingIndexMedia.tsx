import {
  NO_RATINGS,
  DEF_MINI_STAR_WIDTH,
} from '../../constants/ratings-constants';
import DisplayRating from './DisplayRating';

interface StarRatingIndexMediaProps {
  isVote?: boolean;
  rating: number | undefined;
  userRating?: number;
}

//a component to draw with un-responsive rating stars the rating of and
//IndexMedia. The rating has to be provided already calculated.
//Defaults to 0 if undefined

const StarRatingIndexMedia = ({
  rating = 0,
  isVote,
  //userRating,
}: StarRatingIndexMediaProps) => {
  return (
    <span className="flex justify-center items-center flex-col text-2xl font-bold text-gray-500">
      {rating || (
        <div className="text-sm font-normal text-gray-300 text-center pt-2 pb-1 italic">
          {NO_RATINGS}
        </div>
      )}
      <DisplayRating
        className="-mt-0.5"
        rating={rating}
        isVote={isVote}
        starWidth={DEF_MINI_STAR_WIDTH}
      />
    </span>
  );
};

export default StarRatingIndexMedia;
