import { JSX } from 'react';
import { SeasonResponse } from '../../../shared/types/models';
import StarRating from './StarRating';

interface SeasonPosterProps {
  media: SeasonResponse;
}

const SeasonPoster = ({ media }: SeasonPosterProps): JSX.Element => {
  return (
    <div className="bg-white shadow-md w-40 rounded border border-9 border-white ring-1 ring-gray-300 self-start">
      <img
        src={media.image}
        alt={media.name}
        title={media.name}
        className="rounded shadow ring-1 ring-gray-300"
        loading="lazy"
      />
      <div className="text-center">
        <StarRating rating={media.baseRating} valid={true} season={true} />
      </div>
    </div>
  );
};

export default SeasonPoster;
