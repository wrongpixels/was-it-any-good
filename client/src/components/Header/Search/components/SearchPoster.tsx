import { JSX } from 'react';

interface SearchPosterProps {
  imageSrc: string | null;
}

const SearchPoster = ({ imageSrc }: SearchPosterProps): JSX.Element | null => {
  if (!imageSrc) {
    return null;
  }
  return (
    <div className="bg-white border-6 border-white min-w-42 min-h-58 rounded-sm shadow-sm ring-1 ring-gray-300">
      <img
        src={imageSrc}
        className="w-39 min-w-39 object-cover rounded-md"
        alt=""
        loading="lazy"
      />
    </div>
  );
};
export default SearchPoster;
