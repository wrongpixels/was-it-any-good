import { formatDate } from '../../../../../shared/helpers/format-helper';
import { RatingData } from '../../../../../shared/types/models';
import { urlFromRatingData } from '../../../utils/url-helper';
import VerticalMediaPoster from '../../Posters/VerticalMediaPoster';

interface RatingCardsProps {
  ratings: RatingData[];
  showDate?: boolean;
}

const RatingCards = ({ ratings, showDate = true }: RatingCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-self-center">
    {ratings.map(
      (r: RatingData) =>
        r.indexMedia && (
          <span key={r.id} className="relative">
            <VerticalMediaPoster
              name={r.indexMedia.name}
              url={urlFromRatingData(r)}
              image={r.indexMedia.image}
              mediaType={r.mediaType}
              rating={r.userScore}
              isVote={true}
            />
            {showDate && r.updatedAt && (
              <div className="absolute text-white text-xs bg-starbright rounded-full px-2 py-0.5 right-3 top-9 shadow/60">
                {formatDate(r.updatedAt)}
              </div>
            )}
          </span>
        )
    )}
  </div>
);

export default RatingCards;
