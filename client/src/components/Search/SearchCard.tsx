import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { IndexMediaData } from '../../../../shared/types/models';
import { DEF_MINI_STAR_WIDTH } from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import { urlFromIndexMedia } from '../../utils/url-helper';
import LazyImage, { AspectRatio } from '../common/LazyImage';
import DisplayRating from '../Rating/DisplayRating';

interface SearchCardProps {
  media?: IndexMediaData | null;
}

const SearchCard = ({ media }: SearchCardProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);

  return (
    <Link
      to={urlFromIndexMedia(media)}
      className={`${styles.poster.search} flex flex-row overflow-ellipsis ${styles.animations.upOnHover}`}
    >
      <LazyImage
        aspect={AspectRatio.poster}
        src={media.image}
        title={media.name}
        alt={media.name}
        className={`${styles.shadow.subtle} h-40 w-auto`}
      />
      <div className="h-5 m-1 w-full flex flex-col items-center text-gray-600">
        <span className="text-gray-600 px-5">{media.name}</span>
        <span className="font-light">{media.year}</span>
        <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
      </div>
    </Link>
  );
};
export default SearchCard;
