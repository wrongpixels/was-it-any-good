import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarRating from '../Rating/StarRating';
import ExternalLogo from '../Rating/ExternalLogo';
import {
  DEF_MINI_STAR_WIDTH,
  DEF_STAR_WIDTH,
} from '../../constants/ratings-constants';
import { AnimatedDiv } from '../common/AnimatedDiv';
import { styles } from '../../constants/tailwind-styles';

interface PosterRatingProps {
  media: MediaResponse | SeasonResponse;
  rating: number;
  valid?: boolean;
}

const PosterRating = ({
  rating,
  valid = true,
  media,
}: PosterRatingProps): JSX.Element | null => {
  if (isNaN(rating) || !media) {
    return null;
  }

  const isSeason: boolean =
    media.mediaType === MediaType.Season && media.showId !== undefined;
  const starWidth = isSeason ? DEF_MINI_STAR_WIDTH : DEF_STAR_WIDTH;
  return (
    <div className="flex flex-col items-center mt-1 ">
      <div className={`relative ${isSeason ? 'h-6' : 'h-7'}`}>
        <div className="text-gray-300">
          <StarRating
            starWidth={starWidth}
            defaultRating={rating}
            media={media}
          />
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${rating * 10}%` }}
        ></div>
      </div>

      {valid && rating > 0 ? (
        <div className="flex items-center justify-center gap-6 ">
          {!isSeason && (
            <div className={`w-6 ${styles.animations.zoomOnHover}`}>
              <ExternalLogo
                media={media}
                mediaType={media.mediaType}
                tmdb={true}
              />
            </div>
          )}
          <span
            title={rating.toString()}
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
            <AnimatedDiv
              pointerEvents="none"
              animKey={`${media.mediaType}-score-${media.id}`}
              className={`${isSeason ? 'text-2xl' : 'text-3xl'} font-bold text-gray-500 w-10 cursor-default `}
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
                media={media}
                mediaType={media.mediaType}
                tmdb={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center pt-2 pb-1 italic">
          Not enough ratings
        </div>
      )}
    </div>
  );
};

export default PosterRating;
