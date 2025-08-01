import { JSX } from 'react';
import LazyImage from '../../../common/LazyImage';
import { DEF_MINI_STAR_WIDTH } from '../../../../constants/ratings-constants';
import DisplayRating from '../../../Rating/DisplayRating';
import { IndexMediaData } from '../../../../../../shared/types/models';
import { getMediaAverageRating } from '../../../../utils/ratings-helper';
import { styles } from '../../../../constants/tailwind-styles';
import { Link } from 'react-router-dom';
import { urlFromIndexMedia } from '../../../../utils/url-helper';
import imageLinker from '../../../../../../shared/util/image-linker';

interface SuggestionPoster {
  media?: IndexMediaData | null;
}

const SuggestionPoster = ({ media }: SuggestionPoster): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);

  return (
    <Link
      to={urlFromIndexMedia(media)}
      className={`${styles.poster.suggestions}`}
    >
      <LazyImage
        src={imageLinker.getPosterImage(media.image)}
        title={media.name}
        alt={media.name}
        className={`${styles.shadow.subtle} ring-1 ring-gray-200 cursor-`}
      />
      <div className="h-5 m-1">
        <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
      </div>
    </Link>
  );
};
export default SuggestionPoster;
