import { JSX, memo, useState } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import RatingPoster from './PosterRating';
import {
  CardRatingData,
  getCardRatingData,
  getAnyMediaDisplayRating,
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
import { isShow } from '../../../../shared/helpers/media-helper';
import { getVisibleSeasonsCount } from '../../utils/seasons-setter';

interface MediaPagePosterProps {
  media: MediaResponse;
  userId?: number;
}

const MediaPagePoster = ({
  media,
  userId,
}: MediaPagePosterProps): JSX.Element => {
  const isSingleSeasonShow: boolean =
    isShow(media) && getVisibleSeasonsCount(media.seasons) === 1;
  const average: number = getAnyMediaDisplayRating(media);
  const cardRatingData: CardRatingData = getCardRatingData(
    media.releaseDate,
    average,
    media.userRating
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
            media={media}
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
