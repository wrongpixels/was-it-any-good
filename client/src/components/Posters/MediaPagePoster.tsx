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
import { useAnimationTrigger } from '../../hooks/use-animation-trigger';
import IconWatchlistRemove from '../Common/Icons/Lists/IconWatchlistRemove';
import IconWatchlistAdd from '../Common/Icons/Lists/IconWatchlistAdd';

interface MediaPagePosterProps {
  media: MediaResponse;
}

const LABEL_IN: string = 'In Watchlist' as const;
const LABEL_ADD: string = 'Add to Watchlist' as const;
const LABEL_REMOVE: string = 'Remove' as const;

const MediaPagePoster = ({ media }: MediaPagePosterProps): JSX.Element => {
  const average: number = getAnyMediaDisplayRating(media);
  const cardRatingData: CardRatingData = getCardRatingData(
    media.releaseDate,
    average,
    media.userRating
  );
  const { openImageAsOverlay: openAsOverlay } = useOverlay();
  const [triggerHover, setTriggerHover] = useState(false);
  const [triggerUnhover, setTriggerUnhover] = useState(false);
  const [mouseOverPoster, setMouseOverPoster] = useState(false);
  const [mouseOverWatchlist, setMouseOverWatchlist] = useState(false);

  const watchlistLabel: string = media.userWatchlist
    ? mouseOverWatchlist
      ? LABEL_REMOVE
      : LABEL_IN
    : LABEL_ADD;

  return (
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
        {
          <div
            onMouseOver={() => {
              setMouseOverWatchlist(true);
            }}
            onMouseOut={() => {
              setMouseOverWatchlist(false);
            }}
            className={`flex flex-row gap-2 absolute w-full h-[40px] text-sm text-white items-center justify-center bg-starbright/80 transition-all -bottom-10 ${(media.userWatchlist || mouseOverPoster) && 'bottom-0'} ${media.userWatchlist ? 'hover:bg-red-400/80' : 'hover:bg-notigreen/70'} border-t border-t-black/5`}
          >
            {watchlistLabel === LABEL_IN ||
            (watchlistLabel === LABEL_ADD && mouseOverWatchlist) ? (
              <IconWatchlistRemove width={17} className="drop-shadow-xs/30" />
            ) : (
              <IconWatchlistAdd width={17} className="drop-shadow-xs/30" />
            )}
            <span className={styles.shadow.textShadow}>{watchlistLabel}</span>
          </div>
        }
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
  );
};

export default memo(MediaPagePoster);
