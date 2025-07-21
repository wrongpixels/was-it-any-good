import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { IndexMediaData } from '../../../../shared/types/models';
import { DEF_MINI_STAR_WIDTH } from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import {
  mediaTypeToDisplayName,
  urlFromIndexMedia,
} from '../../utils/url-helper';
import LazyImage, { AspectRatio } from '../common/LazyImage';
import DisplayRating from '../Rating/DisplayRating';
import Country from '../../../../shared/types/countries';
import MediaFlags from '../MediaFlags';

interface SearchCardProps {
  media?: IndexMediaData | null;
}

const SearchCard = ({ media }: SearchCardProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);
  const mediaDisplay: string = mediaTypeToDisplayName(media.mediaType);

  return (
    <Link
      to={urlFromIndexMedia(media)}
      className={`${styles.poster.search} flex flex-row overflow-ellipsis ${styles.animations.upOnHover}`}
      title={`${media.name} (${mediaDisplay})`}
    >
      <LazyImage
        aspect={AspectRatio.poster}
        src={media.image}
        alt={media.name}
        className={`${styles.shadow.subtle} h-40 w-auto`}
      />
      <div className="m-1 w-full flex flex-col text-gray-600 px-2 py-2">
        <span className="text-gray-600 leading-5">{media.name}</span>
        <div className="font-light flex flex-row gap-1 text-sm pt-1">
          <span className="font-semibold text-gray-400">{mediaDisplay}</span>
          <>({media.year})</>
        </div>
        <div className="grow" />
        <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
      </div>
    </Link>
  );
};
export default SearchCard;
