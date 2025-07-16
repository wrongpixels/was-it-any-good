import { JSX } from 'react';
import LazyImage from '../../../common/LazyImage';
import { DEF_MINI_STAR_WIDTH } from '../../../../constants/ratings-constants';
import DisplayRating from '../../../Rating/DisplayRating';
import { IndexMediaData } from '../../../../../../shared/types/models';
import { getMediaAverageRating } from '../../../../utils/ratings-helper';

interface SearchPosterProps {
  media?: IndexMediaData | null;
}

const SearchPoster = ({ media }: SearchPosterProps): JSX.Element | null => {
  if (!media) {
    return null;
  }
  const average: number = getMediaAverageRating(media);

  return (
    <div className="bg-white border-6 border-white min-w-42 min-h-58 rounded-sm shadow-sm ring-1 ring-gray-300 flex flex-col items-center">
      <LazyImage src={media.image} alt="" />
      <div className="h-5 m-1">
        <DisplayRating rating={average} starWidth={DEF_MINI_STAR_WIDTH} />
      </div>
    </div>
  );
};
export default SearchPoster;
