import { JSX } from 'react';
import { SeasonResponse } from '../../../../shared/types/models';
import PosterRating from './PosterRating';
import { calculateAverage } from '../../utils/ratings-helper';
import LazyImage from '../common/LazyImage';

interface SeasonPosterProps {
  media: SeasonResponse;
}

const SeasonPoster = ({ media }: SeasonPosterProps): JSX.Element => {
  const average: number = calculateAverage(media);

  return (
    <div className="text-center bg-white shadow-md w-40 rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <div className="text-sm font-medium -translate-y-1.5">
        <div className="truncate" title={media.name}>
          {media.name}
        </div>
      </div>
      <LazyImage
        src={media.image}
        alt={media.name}
        title={media.name}
        className="rounded shadow ring-1 ring-gray-300"
      />
      <div>
        <PosterRating rating={average} media={media} valid={true} />
      </div>
    </div>
  );
};

export default SeasonPoster;
