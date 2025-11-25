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

interface MediaPagePosterProps {
  media: MediaResponse;
}

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
      ? 'Remove'
      : 'In Watchlist'
    : 'Add to Watchlist';

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
        {media.userWatchlist && (
          <div
            onMouseOver={() => {
              setMouseOverWatchlist(true);
            }}
            onMouseOut={() => {
              setMouseOverWatchlist(false);
            }}
            className={`flex absolute w-full h-[35px] text-sm text-white items-center justify-center bg-starbrighter/60 transition-all -bottom-10 ${(media.userWatchlist || mouseOverPoster) && 'bottom-0'} hover:bg-red-400/60 `}
          >
            {watchlistLabel}
          </div>
        )}
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
