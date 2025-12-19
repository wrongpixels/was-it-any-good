import { JSX, memo, useState } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import RatingPoster from './PosterRating';
import {
  CardRatingData,
  getCardRatingData,
  getAnyMediaDisplayRating,
  getTargetRatingMedia,
} from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';
import imageLinker from '../../../../shared/util/image-linker';
import { useOverlay } from '../../context/OverlayProvider';
import LazyImage from '../Common/Custom/LazyImage';
import Tag from '../Common/Custom/Tag';
import WatchlistPosterFooter from '../UserLists/WatchlistPosterFooter';
import {
  NotificationContextValues,
  useNotificationContext,
} from '../../context/NotificationProvider';
import UserLists from '../UserLists/UserLists';

interface MediaPagePosterProps {
  media: MediaResponse;
  userId?: number;
}

//if the media is a Show with a single Season, we make that season be our rating target.
//that way, if a second season is added, we'll use that data for 'Season 1'
//and will start allowing to vote the show itself separately from its Seasons.

const MediaPagePoster = ({
  media,
  userId,
}: MediaPagePosterProps): JSX.Element => {
  const targetRatingMedia: MediaResponse | SeasonResponse =
    getTargetRatingMedia(media);

  const average: number = getAnyMediaDisplayRating(targetRatingMedia);
  const cardRatingData: CardRatingData = getCardRatingData(
    targetRatingMedia.releaseDate,
    average,
    targetRatingMedia.userRating
  );
  const { openImageAsOverlay: openAsOverlay } = useOverlay();
  const [mouseOverPoster, setMouseOverPoster] = useState(false);
  const notification: NotificationContextValues = useNotificationContext();

  return (
    <div className="flex flex-col gap-3" ref={notification.anchorRef}>
      <div className={`${styles.poster.regular()} relative`}>
        <div
          onMouseOver={() => {
            setMouseOverPoster(true);
          }}
          onMouseOut={() => {
            setMouseOverPoster(false);
          }}
          className={`rounded shadow ring-1 ring-gray-300 ${styles.poster.media} relative overflow-hidden`}
        >
          <LazyImage
            src={imageLinker.getPosterImage(media.image)}
            alt={media.name}
            title={media.name}
            onClick={() =>
              openAsOverlay(imageLinker.getFullSizeImage(media.image))
            }
          />
          <WatchlistPosterFooter
            media={media}
            mouseOverPoster={mouseOverPoster}
            notification={notification}
            userId={userId}
          />
        </div>
        {media.releaseDate && cardRatingData.unreleased && (
          <Tag
            className={`right-3 top-3.5 bg-amber-500`}
            text={'Unreleased'}
            title={cardRatingData.ratingText}
          />
        )}

        <div className="text-center">
          <RatingPoster
            rating={average}
            media={targetRatingMedia}
            valid={true}
            cardRatingData={cardRatingData}
          />
        </div>
      </div>
      {userId && (
        <UserLists media={media} userId={userId} notification={notification} />
      )}
    </div>
  );
};

export default memo(MediaPagePoster);
