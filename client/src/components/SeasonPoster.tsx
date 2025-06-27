import { JSX } from 'react';
import { SeasonResponse } from '../../../shared/types/models';
import StarRating from './Rating/StarRating';
import { MediaType } from '../../../shared/types/media';

interface SeasonPosterProps {
  media: SeasonResponse;
}

const SeasonPoster = ({ media }: SeasonPosterProps): JSX.Element => {
  return (
    <div className="text-center bg-white shadow-md w-40 rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <div className="font-medium -translate-y-1">{media.name}</div>
      <img
        src={media.image}
        alt={media.name}
        title={media.name}
        className="rounded shadow ring-1 ring-gray-300"
        loading="lazy"
      />
      <div>
        <StarRating
          rating={media.baseRating}
          media={media}
          valid={true}
          season={media.index}
          mediaType={MediaType.Season}
        />
      </div>
    </div>
  );
};

export default SeasonPoster;
