import { JSX } from 'react';
import { SeasonResponse, ShowResponse } from '../../../../shared/types/models';
import StarRating from '../Rating/StarRating';
import { MediaType } from '../../../../shared/types/media';
import { calculateAverage } from '../../utils/ratings-helper';

interface SeasonPosterProps {
  season: SeasonResponse;
  media: ShowResponse;
}

const SeasonPoster = ({ media, season }: SeasonPosterProps): JSX.Element => {
  const average: number = calculateAverage(season);

  return (
    <div className="text-center bg-white shadow-md w-40 rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <div className="text-sm font-medium -translate-y-1.5">
        <div className="truncate" title={season.name}>
          {season.name}
        </div>
      </div>
      <img
        src={season.image}
        alt={season.name}
        title={season.name}
        className="rounded shadow ring-1 ring-gray-300"
        loading="lazy"
      />
      <div>
        <StarRating
          rating={average}
          media={media}
          season={season}
          valid={true}
          mediaType={MediaType.Season}
        />
      </div>
    </div>
  );
};

export default SeasonPoster;
