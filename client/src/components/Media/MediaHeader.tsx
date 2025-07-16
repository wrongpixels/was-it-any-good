import { MediaResponse } from '../../../../shared/types/models';
import GenreSection from './GenreList';
import Title from '../Title';

interface MediaHeaderProps {
  media: MediaResponse;
}

const MediaHeader = ({ media }: MediaHeaderProps) => {
  return (
    <div>
      <Title
        title={media.name}
        date={media.releaseDate}
        country={media.country}
      />
      <div>
        {media.originalName && media.originalName !== media.name && (
          <div className="text-gray-600 text-sm font-bold">
            AKA:
            <span className="ml-1 text-gray-400 font-normal italic">
              "{media.originalName}"
            </span>
          </div>
        )}
        <div>
          {media.genres && (
            <GenreSection mediaType={media.mediaType} genres={media.genres} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;
