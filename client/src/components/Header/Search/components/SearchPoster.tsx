import { JSX } from 'react';

interface SearchPosterProps {
  imageSrc: string | null;
}

const SearchPoster = ({ imageSrc }: SearchPosterProps): JSX.Element | null => {
  if (!imageSrc) return null;
  return (
    <div className="bg-white border-5 border-white rounded-sm shadow-sm ring-1 ring-gray-300">
      <img
        src={imageSrc}
        className="h-40 w-auto object-contain rounded-md"
        alt=""
      />
    </div>
  );
};
export default SearchPoster;
