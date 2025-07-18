import { JSX } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import PosterRating from './PosterRating';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import LazyImage from '../common/LazyImage';

interface MediaEntryPosterProps {
  media: MediaResponse;
}

const MediaEntryPoster = ({ media }: MediaEntryPosterProps): JSX.Element => {
  const average: number = getMediaAverageRating(media);
  return (
    <div className="bg-white shadow-md rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <LazyImage
        src={media.image}
        alt={media.name}
        title={media.name}
        className="rounded shadow ring-1 ring-gray-300"
      />
      <div className="text-center">
        <PosterRating rating={average} media={media} valid={true} />
      </div>
    </div>
  );
};

export default MediaEntryPoster;
