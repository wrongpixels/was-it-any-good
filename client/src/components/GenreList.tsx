import { JSX } from 'react';
import { GenreResponse } from '../../../shared/types/models';
import React from 'react';

interface GenreSectionProps {
  genres: GenreResponse[];
}

const GenreSection = ({ genres }: GenreSectionProps): JSX.Element | null => {
  if (!genres || genres.length < 1) {
    return null;
  }
  return (
    <div className="flex items-center text-gray-400 gap-2">
      <img src="/genres.png" className="w-5 shadow-xs" />
      <span className="text-sm">
        {genres.map((g: GenreResponse, i: number) => (
          <React.Fragment key={g.id}>
            {i > 0 && ' | '}
            <a className="hover:underline cursor-pointer">{g.name}</a>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

export default GenreSection;
