import { formatDate } from '../../../../../shared/helpers/format-helper';
import { MediaType } from '../../../../../shared/types/media';
import { RatingData } from '../../../../../shared/types/models';
import { urlFromRatingData } from '../../../utils/url-helper';
import Tag from '../../Common/Custom/Tag';
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
              <Tag
                className="right-3 top-9"
                text={formatDate(r.updatedAt)}
                title={`Voted ${formatDate(r.updatedAt)}`}
              />
            )}
            {r.indexMedia.mediaType === MediaType.Season && (
              <Tag
                className="bg-button-green left-3 bottom-17.5"
                text={`Season ${r.indexMedia.season?.index ?? ''}`}
              />
            )}
          </span>
        )
    )}
  </div>
);

export default RatingCards;
