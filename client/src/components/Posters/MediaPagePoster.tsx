import { JSX, memo } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import RatingPoster from './PosterRating';
import {
  CardRatingData,
  getCardRatingData,
  getMediaAverageRating,
} from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';
import imageLinker from '../../../../shared/util/image-linker';
import { useOverlay } from '../../context/OverlayProvider';
import LazyImage from '../Common/Custom/LazyImage';
import Tag from '../Common/Custom/Tag';

interface MediaPagePosterProps {
  media: MediaResponse;
}

const MediaPagePoster = ({ media }: MediaPagePosterProps): JSX.Element => {
  const average: number = getMediaAverageRating(media);
  const cardRatingData: CardRatingData = getCardRatingData(
    media.releaseDate,
    average,
    media.userRating
  );
  const { openImageAsOverlay: openAsOverlay } = useOverlay();

  return (
    <div className={`${styles.poster.regular()}  relative`}>
      <LazyImage
        src={imageLinker.getPosterImage(media.image)}
        alt={media.name}
        title={media.name}
        className={`rounded shadow ring-1 ring-gray-300 ${styles.poster.media}`}
        onClick={() => openAsOverlay(imageLinker.getFullSizeImage(media.image))}
      />
      {media.releaseDate && cardRatingData.unreleased && (
        <Tag
          className={`right-3 top-3.5 bg-amber-500`}
          text={'Unreleased'}
          title={cardRatingData.ratingText}
        />
      )}
      <div className="text-center">
        <RatingPoster
          rating={average}
          media={media}
          valid={true}
          cardRatingData={cardRatingData}
        />
      </div>
    </div>
  );
};

export default memo(MediaPagePoster);
