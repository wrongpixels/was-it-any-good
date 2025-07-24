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
import CountryFlags from '../Media/MediaCountryFlags';

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
      className={`${styles.poster.search} justify-center flex flex-row overflow-ellipsis ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover}`}
      title={`${media.name} (${mediaDisplay})`}
    >
      <LazyImage
        aspect={AspectRatio.poster}
        src={media.image}
        alt={media.name}
        className={`${styles.shadow.subtle} h-full w-auto`}
      />
      <div className="flex flex-col w-full my-2  text-gray-600">
        <span className="pl-2 w-full">
          <span className="text-gray-600 leading-5">{media.name}</span>
          <span className="font-light text-sm pt-1 flex flex-row gap-1 items-center">
            <span className="font-semibold text-gray-400">{mediaDisplay}</span>(
            {media.year})
            <CountryFlags
              className="mb-1"
              countryCodes={[media.country[0]]}
              useLink={false}
            />
          </span>
          {/* Space for add to list etc*/}
        </span>
        <div className="grow" />
        <span className="flex justify-center items-center flex-col text-2xl font-bold text-gray-500">
          {average}
          <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
        </span>
      </div>
    </Link>
  );
};
export default SearchCard;
