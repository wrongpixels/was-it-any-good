import { JSX } from 'react';
import LazyImage from '../../../common/LazyImage';
import { DEF_MINI_STAR_WIDTH } from '../../../../constants/ratings-constants';
import DisplayRating from '../../../Rating/DisplayRating';
import { IndexMediaData } from '../../../../../../shared/types/models';
import { getMediaAverageRating } from '../../../../utils/ratings-helper';
import { styles } from '../../../../constants/tailwind-styles';

interface SearchPosterProps {
  media?: IndexMediaData | null;
}

const SearchPoster = ({ media }: SearchPosterProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);

  return (
    <div className={`${styles.poster.search}`}>
      <LazyImage
        src={media.image}
        alt=""
        className={`${styles.shadow.subtle} ring-1 ring-gray-200`}
      />
      <div className="h-5 m-1">
        <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
      </div>
    </div>
  );
};
export default SearchPoster;
