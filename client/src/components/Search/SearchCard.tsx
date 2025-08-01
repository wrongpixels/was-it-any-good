import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { IndexMediaData } from '../../../../shared/types/models';
import {
  DEF_MINI_STAR_WIDTH,
  NO_RATINGS,
} from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import {
  mediaTypeToDisplayName,
  urlFromIndexMedia,
} from '../../utils/url-helper';
import LazyImage, { AspectRatio } from '../common/LazyImage';
import DisplayRating from '../Rating/DisplayRating';
import CountryFlags from '../Media/MediaCountryFlags';
import IndexBadge from './Browse/IndexBadge';
import imageLinker from '../../../../shared/util/image-linker';

interface SearchCardProps {
  media?: IndexMediaData | null;
  showBadge?: boolean;
  index: number;
}

const SearchCard = ({
  media,
  index,
  showBadge,
}: SearchCardProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);
  const mediaDisplay: string = mediaTypeToDisplayName(media.mediaType);

  return (
    <Link
      to={urlFromIndexMedia(media)}
      className={`${styles.poster.search} flex flex-row ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover}`}
      title={`${media.name} (${mediaDisplay})`}
    >
      <span className="w-50 h-auto relative">
        <LazyImage
          aspect={AspectRatio.poster}
          src={imageLinker.getPosterImage(media.image)}
          alt={media.name}
          className={'drop-shadow ring-1 ring-gray-300'}
        />
        {showBadge && <IndexBadge index={index} />}
      </span>
      <div className="flex flex-col w-full pl-3.5 my-2 text-gray-600">
        <span className="text-gray-600 leading-5 line-clamp-3">
          {media.name}
        </span>
        <span className="font-light text-sm pt-1 flex flex-row gap-1 items-center">
          <span className="font-semibold text-gray-400">{mediaDisplay}</span>
          {media.year ? `(${media.year})` : ''}
          <CountryFlags
            className="mb-1 ml-1"
            countryCodes={media.country ? [media.country[0]] : []}
            useLink={false}
          />
          {/* Space for add to list etc*/}
        </span>
        <div className="grow" />
        <span className="flex justify-center items-center flex-col text-2xl font-bold text-gray-500 pr-1">
          {average ? (
            average
          ) : (
            <div className="text-sm font-normal text-gray-300 text-center pt-2 pb-1 italic">
              {NO_RATINGS}
            </div>
          )}
          <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
        </span>
      </div>
    </Link>
  );
};
export default SearchCard;
