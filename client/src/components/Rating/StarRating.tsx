import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarIcons from './StarIcons';
import ExternalLogo from './ExternalLogo';

interface PropsStarRating {
  media: MediaResponse | SeasonResponse;
  rating: number;
  valid?: boolean;
}

const StarRating = ({
  rating,
  valid = true,
  media,
}: PropsStarRating): JSX.Element | null => {
  if (isNaN(rating)) {
    return null;
  }
  const isSeason: boolean =
    media.mediaType === MediaType.Season && media.showId !== undefined;
  const starWidth = isSeason ? 23 : 26;
  return (
    <div className="flex flex-col items-center mt-1 ">
      <div className={`relative ${isSeason ? 'h-6' : 'h-7'}`}>
        <div className="text-gray-300">
          <StarIcons
            starWidth={starWidth}
            defaultRating={rating}
            mediaId={media.id}
            mediaType={media.mediaType}
            showId={
              media.mediaType === MediaType.Season ? media.showId : undefined
            }
          />
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${rating * 10}%` }}
        ></div>
      </div>

      {valid && rating > 0 ? (
        <div className="flex items-center justify-center gap-6">
          {!isSeason && (
            <div className="w-6">
              <ExternalLogo
                media={media}
                mediaType={media.mediaType}
                tmdb={true}
              />
            </div>
          )}
          <span
            className={`${isSeason ? 'text-2xl' : 'text-3xl'} font-bold text-gray-500 w-10`}
          >
            {rating}
          </span>
          {!isSeason && (
            <div className="w-6 opacity-80">
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

export default StarRating;
