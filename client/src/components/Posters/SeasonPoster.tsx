import { JSX } from 'react';
import { SeasonResponse } from '../../../../shared/types/models';
import RatingPoster from './PosterRating';
import {
  CardRatingData,
  getCardRatingData,
  getAnyMediaDisplayRating,
} from '../../utils/ratings-helper';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import { OverlayValues, useOverlay } from '../../context/OverlayProvider';
import LazyImage, { ImageVariant } from '../Common/Custom/LazyImage';
import {
  formatRatingDate,
  getYearString,
} from '../../../../shared/helpers/format-helper';
import Tag from '../Common/Custom/Tag';

interface SeasonPosterProps {
  media: SeasonResponse;
}

const SeasonPoster = ({ media }: SeasonPosterProps): JSX.Element => {
  const average: number = getAnyMediaDisplayRating(media);
  const cardRatingData: CardRatingData = getCardRatingData(
    media.releaseDate,
    average,
    media.userRating
  );
  const { openImageAsOverlay }: OverlayValues = useOverlay();

  return (
    <div className={`${styles.poster.regular()} w-40 relative`}>
      <div className="text-sm font-medium text-center -translate-y-1">
        <div className="truncate" title={media.name}>
          {media.name}
        </div>
      </div>
      <LazyImage
        variant={ImageVariant.default}
        src={imageLinker.getPosterImage(media.image)}
        alt={media.name}
        title={media.name}
        className={`rounded shadow ${styles.poster.media}`}
        onClick={() =>
          openImageAsOverlay(imageLinker.getFullSizeImage(media.image))
        }
      />
      <div className="text-center">
        <RatingPoster
          rating={average}
          isSeason={true}
          media={media}
          valid={true}
          cardRatingData={cardRatingData}
        />
      </div>
      {media.releaseDate && (
        <Tag
          className={`right-3 top-8 ${cardRatingData.unreleased && 'bg-amber-500'}`}
          text={
            cardRatingData.unreleased
              ? 'Unreleased'
              : getYearString(media.releaseDate)
          }
          title={
            cardRatingData.unreleased
              ? cardRatingData.ratingText
              : `Released ${formatRatingDate(media.releaseDate)}`
          }
        />
      )}
    </div>
  );
};

export default SeasonPoster;
