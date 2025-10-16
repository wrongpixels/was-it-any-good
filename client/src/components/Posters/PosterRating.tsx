import { JSX, memo } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarRating from '../Rating/StarRating';
import ExternalLogo from '../Rating/ExternalLogo';
import {
  DEF_MINI_STAR_WIDTH,
  DEF_STAR_WIDTH,
  NO_RATINGS,
} from '../../constants/ratings-constants';
import { styles } from '../../constants/tailwind-styles';
import { AnimatedDiv } from '../Common/Custom/AnimatedDiv';
import DisplayRating from '../Rating/DisplayRating';
import { formatRatingDate } from '../../../../shared/helpers/format-helper';

interface RatingPosterProps {
  media: MediaResponse | SeasonResponse;
  rating: number;
  valid?: boolean;
}

const RatingPoster = ({
  rating,
  valid = true,
  media,
}: RatingPosterProps): JSX.Element | null => {
  if (isNaN(rating) || !media) {
    return null;
  }
  //to know if the season is not released yet
  const releaseDate: Date | null = !media.releaseDate
    ? null
    : new Date(media.releaseDate);
  const unreleased: boolean = !releaseDate ? false : new Date() < releaseDate;
  const posterText: string = !releaseDate
    ? 'Not released yet'
    : `Available ${formatRatingDate(releaseDate)}`;

  const ratingTitle: string = `WIAG score: ${rating}`;
  const userRatingTitle: string = media.userRating
    ? `\nYour rating: ${media.userRating.userScore}`
    : '';
  const isSeason: boolean =
    media.mediaType === MediaType.Season && media.showId !== undefined;
  const starWidth = isSeason ? DEF_MINI_STAR_WIDTH : DEF_STAR_WIDTH;
  return (
    <div className="flex flex-col items-center mt-1 ">
      <div className={`relative ${isSeason ? 'h-6' : 'h-7'}`}>
        <div className="text-gray-300">
          {unreleased ? (
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

      {valid && !unreleased && rating > 0 ? (
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
            title={`${ratingTitle}${userRatingTitle}`}
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
          {unreleased ? posterText : NO_RATINGS}
        </div>
      )}
    </div>
  );
};

export default memo(RatingPoster);
