import { JSX } from 'react';
import { GenreResponse } from '../../../../shared/types/models';
import React from 'react';
import { MediaType } from '../../../../shared/types/media';
import IconForMediaType from '../Header/Search/icons/IconForMediaType';
import SelectedLine from '../common/SelectedLine';

interface GenreSectionProps {
  genres: GenreResponse[];
  mediaType: MediaType;
}

const GenreSection = ({
  genres,
  mediaType,
}: GenreSectionProps): JSX.Element | null => {
  if (!genres || genres.length < 1) {
    return null;
  }
  return (
    <div className="flex items-center text-gray-400 gap-2 relative ml-1 pl-2">
      <SelectedLine height={3} />
      <IconForMediaType mediaType={mediaType} className="text-gray-600" />
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
