import { JSX } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import RatingPoster from './PosterRating';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';
import imageLinker from '../../../../shared/util/image-linker';
import { useOverlay } from '../../context/OverlayProvider';
import LazyImage from '../Common/Custom/LazyImage';

interface MediaPagePosterProps {
  media: MediaResponse;
}

const MediaPagePoster = ({ media }: MediaPagePosterProps): JSX.Element => {
  const average: number = getMediaAverageRating(media);
  const { openImageAsOverlay: openAsOverlay } = useOverlay();

  return (
    <div className={`${styles.poster.regular()}`}>
      <LazyImage
        src={imageLinker.getPosterImage(media.image)}
        alt={media.name}
        title={media.name}
        className={`rounded shadow ring-1 ring-gray-300 ${styles.poster.media}`}
        onClick={() => openAsOverlay(imageLinker.getFullSizeImage(media.image))}
      />
      <div className="text-center">
        <RatingPoster rating={average} media={media} valid={true} />
      </div>
    </div>
  );
};

export default MediaPagePoster;
