import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarIcons from './StarIcons';
import ExternalLogo from './ExternalLogo';

interface PropsStarRating {
  media: MediaResponse;
  mediaType: MediaType;
  rating: number;
  valid?: boolean;
  season?: SeasonResponse;
}

const StarRating = ({
  rating,
  valid = true,
  media,
  mediaType,
  season,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  const isSeason: boolean =
    mediaType === MediaType.Season && season !== undefined;
  const starWidth = isSeason ? 23 : 26;

  return (
    <div className="flex flex-col items-center mt-1 ">
      <div
        className={`relative ${mediaType === MediaType.Season ? 'h-6' : 'h-7'}`}
      >
        <div className="text-gray-300">
          <StarIcons
            starWidth={starWidth}
            defaultRating={rating}
            mediaId={media.id}
            mediaType={mediaType}
            seasonId={season?.id}
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
              <ExternalLogo media={media} mediaType={mediaType} tmdb={true} />
            </div>
          )}
          <span
            className={`${isSeason ? 'text-2xl' : 'text-3xl'} font-bold text-gray-500 w-10`}
          >
            {rating}
          </span>
          {!isSeason && (
            <div className="w-6 opacity-80">
              <ExternalLogo media={media} mediaType={mediaType} tmdb={false} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center pt-1 pb-1 italic">
          Not enough ratings
        </div>
      )}
    </div>
  );
};

export default StarRating;
