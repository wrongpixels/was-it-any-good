import { JSX } from 'react';
import { SeasonResponse } from '../../../../shared/types/models';
import PosterRating from './PosterRating';
import LazyImage, { ImageVariant } from '../common/LazyImage';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import { OverlayValues, useOverlay } from '../../context/OverlayProvider';

interface SeasonPosterProps {
  media: SeasonResponse;
}

const SeasonPoster = ({ media }: SeasonPosterProps): JSX.Element => {
  const average: number = getMediaAverageRating(media);
  const { openImageAsOverlay }: OverlayValues = useOverlay();

  return (
    <div className={`${styles.poster.regular()} w-40`}>
      <div className="text-sm font-medium text-center -translate-y-1">
        <div className="truncate" title={media.name}>
          {media.name}
        </div>
      </div>
      <LazyImage
        variant={ImageVariant.inline}
        src={imageLinker.getPosterImage(media.image)}
        alt={media.name}
        title={media.name}
        className={`rounded shadow ${styles.poster.media}`}
        onClick={() =>
          openImageAsOverlay(imageLinker.getFullSizeImage(media.image))
        }
      />
      <div className="text-center">
        <PosterRating rating={average} media={media} valid={true} />
      </div>
    </div>
  );
};

export default SeasonPoster;
