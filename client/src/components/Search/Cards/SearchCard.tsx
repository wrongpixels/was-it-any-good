import { JSX, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IndexMediaData,
  MediaResponse,
  SeasonResponse,
} from '../../../../../shared/types/models';
import { styles } from '../../../constants/tailwind-styles';
import {
  getIndexMediaUserRating,
  getAnyMediaDisplayRating,
} from '../../../utils/ratings-helper';
import { mediaTypeToDisplayName } from '../../../utils/url-helper';
import CountryFlags from '../../Media/Sections/MediaCountryFlags';
import imageLinker from '../../../../../shared/util/image-linker';
import { getIndexMediaGenresAsUrlMap } from '../../../utils/index-media-helper';
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
import {
  buildIndexMediaLinkWithSlug,
  getMediaFromIndexMedia,
  getMediaIdFromIndexMedia,
} from '../../../../../shared/util/url-builder';
import CloseButton from '../../Common/CloseButton';
import { BrowseCacheOps } from '../../../hooks/use-results-list-values';
import WatchlistPosterFooter from '../../UserLists/WatchlistPosterFooter';
import { NotificationContextValues } from '../../../context/NotificationProvider';

const DELETE_ANIMATION_DURATION: number = 125 as const;

interface SearchCardProps {
  media?: IndexMediaData | null;
  badgeType: BadgeType;
  index: number;
  userId?: number;
  notification: NotificationContextValues;
  browseCacheOps?: BrowseCacheOps;
}

const getBadge = (badgeType: BadgeType, index: number): JSX.Element | null => {
  switch (badgeType) {
    case BadgeType.IndexBadge:
      return <IndexBadge index={index} />;
    case BadgeType.RankBadge:
      return <IndexBadge index={index} isRank={true} />;
    case BadgeType.AddedBadge:
      return <WIAGBadge />;
    default:
      return null;
  }
};

const SearchCard = ({
  media,
  index,
  userId,
  notification,
  badgeType = BadgeType.None,
  browseCacheOps,
}: SearchCardProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const [animTrigger, setAnimTrigger] = useState(false);
  const [mouseOverPoster, setMouseOverPoster] = useState(false);
  const realBadgeType: BadgeType =
    badgeType === BadgeType.AddedBadge && !media.addedToMedia
      ? BadgeType.None
      : badgeType;
  const average: number = getAnyMediaDisplayRating(media);
  const mediaDisplay: string = mediaTypeToDisplayName(media.mediaType);
  const genreMap: GenreUrlMap[] | null = useMemo(
    () => getIndexMediaGenresAsUrlMap(media),
    [media]
  );
  const mediaInIndex: MediaResponse | SeasonResponse | null =
    getMediaFromIndexMedia(media);

  const removeFromList = () => {
    setAnimTrigger(true);
    //we sync with the animation so the card disappears even if the refetch hasn't finished yet.
    setTimeout(() => {
      browseCacheOps?.removeFromBrowseCache(media.id);
    }, DELETE_ANIMATION_DURATION);
    browseCacheOps?.listMutation?.mutate(
      {
        inList: true,
        indexId: media.id,
        userId: browseCacheOps.userListValues.userId,
      },
      {
        onSuccess: () =>
          browseCacheOps.resetBrowseCache(
            media.mediaType,
            getMediaIdFromIndexMedia(media)
          ),
      }
    );
  };
  //to apply special designs to the Cards for editable lists (like making space for an 'X' button on top)
  const canEditItems: boolean = !!browseCacheOps?.userListValues.canEditItems;

  return (
    <Link
      to={buildIndexMediaLinkWithSlug(media)}
      className={`relative ${styles.poster.search.byBadgeType(realBadgeType, index)} flex flex-row ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover} max-w-90 ${animTrigger ? 'transition-opacity duration-250 opacity-0' : 'opacity-100'}`}
      title={`${media.name} (${mediaDisplay})`}
    >
      <div className={'relative rounded drop-shadow ring-1 ring-gray-300 '}>
        <div
          onMouseOver={() => {
            setMouseOverPoster(true);
          }}
          onMouseOut={() => {
            setMouseOverPoster(false);
          }}
          className="relative overflow-hidden rounded"
        >
          <LazyImage
            variant={ImageVariant.inline}
            aspect={AspectRatio.poster}
            src={imageLinker.getPosterImage(media.image)}
            alt={media.name}
            className={'w-47 h-43'}
          />
          {browseCacheOps?.userListValues.listName !== 'Watchlist' &&
            userId &&
            mediaInIndex && (
              <WatchlistPosterFooter
                media={mediaInIndex}
                mouseOverPoster={mouseOverPoster}
                notification={notification}
                userId={userId}
                size="small"
              />
            )}
        </div>
        {getBadge(realBadgeType, index)}
      </div>
      <div
        className={`flex flex-col w-full pl-3 ${canEditItems ? 'mt-3.5' : 'mt-1'} text-gray-600`}
      >
        <span className="text-gray-600 leading-5 line-clamp-2">
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
        <StarRatingIndexMedia
          rating={average}
          userRating={getIndexMediaUserRating(media)}
          canEditItems={canEditItems}
          releaseDate={media.releaseDate}
        />
      </div>
      {browseCacheOps?.userListValues.canEditItems && (
        <div
          className="z-10 absolute right-0.75 top-0.5"
          title={'Remove from list'}
        >
          <CloseButton onClick={() => removeFromList()} />
        </div>
      )}
    </Link>
  );
};
export default React.memo(SearchCard);
