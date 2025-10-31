import { JSX, memo } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarRating from '../Rating/StarRating';
import ExternalLogo from '../Rating/ExternalLogo';
import {
  DEF_MINI_STAR_WIDTH,
  DEF_STAR_WIDTH,
} from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { AnimatedDiv } from '../Common/Custom/AnimatedDiv';
import DisplayRating from '../Rating/DisplayRating';
import { CardRatingData } from '../../utils/ratings-helper';

interface RatingPosterProps {
  media: MediaResponse | SeasonResponse;
  rating: number;
  cardRatingData: CardRatingData;
  valid?: boolean;
}

const RatingPoster = ({
  rating,
  valid = true,
  media,
  cardRatingData,
}: RatingPosterProps): JSX.Element | null => {
  if (isNaN(rating) || !media) {
    return null;
  }
  //to know if the media is not released yet

  const isSeason: boolean =
    media.mediaType === MediaType.Season && media.showId !== undefined;
  const starWidth = isSeason ? DEF_MINI_STAR_WIDTH : DEF_STAR_WIDTH;
  return (
    <div className="flex flex-col items-center mt-1 ">
      <div className={`relative ${isSeason ? 'h-6' : 'h-7'}`}>
        <div className="text-gray-300">
          {cardRatingData.unreleased ? (
            <DisplayRating rating={0} starWidth={starWidth} className="pt-1" />
          ) : (
            <StarRating
              starWidth={starWidth}
              defaultRating={rating}
              media={media}
            />
          )}
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${rating * 10}%` }}
        ></div>
      </div>

      {valid && !cardRatingData.hasRatingText ? (
        <div className="flex items-center justify-center gap-6 ">
          {!isSeason && (
            <div className={`w-6 ${styles.animations.zoomOnHover}`}>
              <ExternalLogo
                id={media.tmdbId}
                mediaType={media.mediaType}
                tmdb={true}
              />
            </div>
          )}
          <span
            title={cardRatingData.ratingTitle}
            itemScope
            itemType="https://schema.org/AggregateRating"
            className="cursor-help"
          >
            <AnimatedDiv
              pointerEvents="none"
              animKey={`${media.mediaType}-score-${media.id}`}
              className={`${isSeason ? 'text-2xl' : 'text-3xl'} font-bold text-gray-500 w-10 `}
              itemProp="ratingValue"
            >
              {rating}
            </AnimatedDiv>
            <meta itemProp="bestRating" content="10" />
            <meta itemProp="ratingCount" content={media.voteCount.toString()} />
          </span>
          {!isSeason && (
            <div className={`w-6 opacity-80 ${styles.animations.zoomOnHover}`}>
              <ExternalLogo
                id={media.imdbId}
                mediaType={media.mediaType}
                tmdb={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`text-sm text-gray-400 text-center ${!isSeason ? 'py-2 ' : 'pt-2 pb-1 '}italic`}
        >
          {cardRatingData.ratingText}
        </div>
      )}
    </div>
  );
};

export default memo(RatingPoster);
