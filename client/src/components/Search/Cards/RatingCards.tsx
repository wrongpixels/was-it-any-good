import {
  formatRatingDate,
  slugifyUrl,
} from '../../../../../shared/helpers/format-helper';
import { MediaType } from '../../../../../shared/types/media';
import { RatingData } from '../../../../../shared/types/models';
import { urlFromRatingData } from '../../../../../shared/util/url-builder';
import { TagContent } from '../../Common/Custom/Tag';
import VerticalMediaPoster from '../../Posters/VerticalMediaPoster';

interface RatingCardsProps {
  ratings: RatingData[];
  showDate?: boolean;
}

const RatingCards = ({ ratings, showDate = true }: RatingCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-self-center">
    {ratings.map((r: RatingData) => {
      const mainTag: TagContent | undefined =
        showDate && r.updatedAt
          ? {
              // icon: <SmallIconForMediaType mediaType={r.mediaType} />,
              text: formatRatingDate(r.updatedAt),
              title: `Voted ${formatRatingDate(r.updatedAt)}`,
            }
          : undefined;

      const secondaryTag: TagContent | undefined =
        r.indexMedia?.mediaType === MediaType.Season
          ? {
              text: `Season ${r.indexMedia.season?.index ?? ''}`,
              title: r.indexMedia.name,
            }
          : undefined;
      return (
        r.indexMedia && (
          <span key={r.id} className="relative">
            <VerticalMediaPoster
              name={r.indexMedia.name}
              mainTag={mainTag}
              secondaryTag={secondaryTag}
              url={slugifyUrl(urlFromRatingData(r), r.indexMedia.name)}
              image={r.indexMedia.image}
              releaseDate={r.indexMedia.releaseDate}
              mediaType={r.mediaType}
              rating={r.userScore}
              isVote={true}
            />
          </span>
        )
      );
    })}
  </div>
);

export default RatingCards;
