import { JSX } from 'react';
import LazyImage from '../../../common/LazyImage';

interface SearchPosterProps {
  imageSrc: string | null;
}

const SearchPoster = ({ imageSrc }: SearchPosterProps): JSX.Element | null => {
  if (!imageSrc) {
    return null;
  }
  return (
    <div className="bg-white border-6 border-white min-w-42 min-h-58 rounded-sm shadow-sm ring-1 ring-gray-300">
      <LazyImage src={imageSrc} alt="" />
    </div>
  );
};
export default SearchPoster;
