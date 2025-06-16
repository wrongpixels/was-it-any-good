import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../shared/types/models';
import StarRating from './StarRating';

interface MediaPosterProps {
  media: MediaResponse | SeasonResponse;
}

const MediaPoster = ({ media }: MediaPosterProps): JSX.Element => {
  return (
    <div className="w-50 bg-white shadow-md rounded border border-9 border-white ring-1 ring-gray-300 self-start">
      <img
        src={media.image}
        alt={media.name}
        title={media.name}
        className="rounded shadow ring-1 ring-gray-300"
        loading="lazy"
      />
      <div className="text-center">
        <StarRating rating={media.baseRating} valid={true} />
      </div>
    </div>
  );
};

export default MediaPoster;
