import { JSX, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IndexMediaData } from '../../../../../shared/types/models';
import { styles } from '../../../constants/tailwind-styles';
import { getMediaAverageRating } from '../../../utils/ratings-helper';
import {
  mediaTypeToDisplayName,
  urlFromIndexMedia,
} from '../../../utils/url-helper';
import CountryFlags from '../../Media/Sections/MediaCountryFlags';
import imageLinker from '../../../../../shared/util/image-linker';
import { getMediaGenres } from '../../../utils/index-media-helper';
import { GenreUrlMap } from '../../../utils/genre-mapper';
import React from 'react';
import { BadgeType } from '../../../types/search-browse-types';
import StarRatingIndexMedia from '../../Rating/StarRatingIndexMedia';
import Bubble from '../../Common/Custom/Bubble';
import LazyImage, {
  AspectRatio,
  ImageVariant,
} from '../../Common/Custom/LazyImage';
import IndexBadge from '../../Common/Icons/Badges/IndexBadge';
import WIAGBadge from '../../Common/Icons/Badges/WIAGBadge';

interface SearchCardProps {
  media?: IndexMediaData | null;
  badgeType: BadgeType;
  index: number;
}

const getBadge = (badgeType: BadgeType, index: number): JSX.Element | null => {
  switch (badgeType) {
    case BadgeType.RankBadge:
      return <IndexBadge index={index} />;
    case BadgeType.AddedBadge:
      return <WIAGBadge />;
    default:
      return null;
  }
};

const SearchCard = ({
  media,
  index,
  badgeType = BadgeType.None,
}: SearchCardProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const realBadgeType: BadgeType =
    badgeType === BadgeType.AddedBadge && !media.addedToMedia
      ? BadgeType.None
      : badgeType;
  const average: number = getMediaAverageRating(media);
  const mediaDisplay: string = mediaTypeToDisplayName(media.mediaType);
  const genreMap: GenreUrlMap[] | null = useMemo(
    () => getMediaGenres(media),
    [media]
  );

  return (
    <Link
      to={urlFromIndexMedia(media)}
      className={`${styles.poster.search.byBadgeType(realBadgeType, index)} flex flex-row ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover} max-w-90`}
      title={`${media.name} (${mediaDisplay})`}
    >
      <span className={'relative rounded'}>
        <LazyImage
          variant={ImageVariant.inline}
          aspect={AspectRatio.poster}
          src={imageLinker.getPosterImage(media.image)}
          alt={media.name}
          className={'drop-shadow ring-1 ring-gray-300 rounded w-47 h-43'}
        />
        {getBadge(realBadgeType, index)}
      </span>
      <div className="flex flex-col w-full pl-3 mt-1 text-gray-600">
        <span className="text-gray-600 leading-5 line-clamp-3">
          {media.name}
        </span>
        <span className="flex flex-col">
          <span className="font-light text-sm pt-0 flex flex-row gap-1 items-center relative">
            <span className="font-semibold text-gray-400">{mediaDisplay}</span>
            {media.year ? `(${media.year})` : ''}
            <CountryFlags
              className="ml-1 gap-1 mb-0.5"
              countryCodes={media.country ? media.country.slice(0, 2) : []}
              useLink={false}
            />
            <div className="h-5 overflow-clip absolute top-0 left-0 mt-7">
              <span className="flex flex-wrap gap-1">
                {genreMap &&
                  genreMap.map((g: GenreUrlMap) => (
                    <Bubble key={g.id} text={g.name} />
                  ))}
              </span>
            </div>
          </span>
        </span>
        <div className="grow" />
        <StarRatingIndexMedia value={average} />
      </div>
    </Link>
  );
};
export default React.memo(SearchCard);
