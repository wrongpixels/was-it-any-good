import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import StarIcons from './StarIcons';
import ExternalLogo from './ExternalLogo';

interface PropsStarRating {
  media: MediaResponse | SeasonResponse;
  mediaType: MediaType;
  rating: number;
  valid?: boolean;
  season?: boolean;
}

const StarRating = ({
  rating,
  valid = true,
  season = false,
  media,
  mediaType,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  const starWidth = season ? 23 : 26;

  return (
    <div className="flex flex-col items-center mt-1 ">
      <div className={`relative ${season ? 'h-6' : 'h-7'}`}>
        <div className="text-gray-300">
          <StarIcons width={starWidth} />
        </div>
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${rating * 10}%` }}
        >
          <div className="text-[#6d90cf]">
            <StarIcons width={starWidth} />
          </div>
        </div>
      </div>

      {valid && rating > 0 ? (
        <div className="flex items-center justify-center gap-6">
          {!season && (
            <div className="w-6">
              <ExternalLogo media={media} mediaType={mediaType} tmdb={true} />
            </div>
          )}
          <span
            className={`${season ? 'text-2xl' : 'text-3xl'} font-bold text-gray-500`}
          >
            {rating}
          </span>
          {!season && (
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
