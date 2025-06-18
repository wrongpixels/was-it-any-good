import { JSX } from 'react';
import { MediaResponse } from '../../../shared/types/models';
import StarRating from './Rating/StarRating';

interface MediaPosterProps {
  media: MediaResponse;
}

const MediaPoster = ({ media }: MediaPosterProps): JSX.Element => {
  return (
    <div>
      <div className="bg-white shadow-md rounded border border-9 border-white ring-1 ring-gray-300 self-start">
        <img
          src={media.image}
          alt={media.name}
          title={media.name}
          className="rounded shadow ring-1 ring-gray-300"
          loading="lazy"
        />
        <div className="text-center">
          <StarRating
            rating={media.baseRating}
            media={media}
            valid={true}
            mediaType={media.mediaType}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaPoster;
