import { MediaResponse } from '../../../shared/types/models';
import { getYear } from '../utils/format-helper';
import GenreSection from './GenreList';
import MediaFlags from './MediaFlags';

interface MediaHeaderProps {
  media: MediaResponse;
}

const MediaHeader = ({ media }: MediaHeaderProps) => {
  return (
    <div>
      <h2 className="text-3xl flex items-center gap-2 border-b border-gray-200 pb-3 mb-2">
        <span className="font-bold">{media.name}</span>
        <span className="text-gray-400 font-regular">
          {getYear(media.releaseDate)}
        </span>
        <MediaFlags countryCodes={media.country} />
      </h2>
      <div>
        {media.originalName && media.originalName !== media.name && (
          <div className="text-gray-600 text-sm font-bold">
            AKA:
            <span className="ml-1 text-gray-400 font-normal italic">
              "{media.originalName}"
            </span>
          </div>
        )}
        <span>{media.genres && <GenreSection genres={media.genres} />}</span>
      </div>
    </div>
  );
};

export default MediaHeader;
