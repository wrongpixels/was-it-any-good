import { JSX } from 'react';
import EntrySection from '../EntrySection';
import { AuthorType } from '../../../../shared/types/roles';
import { MediaType } from '../../../../shared/types/media';
import MediaPoster from '../Poster/MediaPoster';
import MediaHeader from './MediaHeader';
import SeasonsEntry from './SeasonsEntry';
import { PathMatch, useMatch } from 'react-router-dom';
import { buildMediaURL } from '../../services/media-service';
import {
  useMediaByIdQuery,
  useMediaByTMDBQuery,
} from '../../queries/media-queries';
import MediaMissing from './MediaMissing';
import { setTitle } from '../../utils/page-info-setter';
import {
  UNKNOWN_CAST,
  UNKNOWN_CREW,
  DEF_CREW_TV,
  DEF_SYNOPSIS,
} from '../../../../shared/defaults/media-defaults';

interface MediaEntryProps {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaEntry = ({
  tmdb = false,
  mediaType,
}: MediaEntryProps): JSX.Element | null => {
  const match: PathMatch<'id'> | null = useMatch(
    `${buildMediaURL(mediaType, tmdb)}/:id`
  );
  const mediaId: string | undefined = match?.params.id;
  const {
    data: media,
    isLoading,
    isError,
    error,
  } = tmdb
    ? useMediaByTMDBQuery(mediaId, mediaType)
    : useMediaByIdQuery(mediaId, mediaType);

  if (mediaId && isNaN(Number(mediaId))) {
    setTitle('Wrong id format');
    return (
      <div className="flex flex-col items-center justify-center w-full font-medium text-2xl gap-4 whitespace-pre-line">
        Wrong ID format!
        <div className="text-lg font-normal">Ids can only have numbers</div>
      </div>
    );
  }

  if (isLoading || isError) {
    setTitle(`${isLoading ? `Loading ${mediaType}...` : 'Error'}`);
    if (isError) {
      console.log(error);
    }
    return (
      <div className="flex justify-center w-full font-medium text-xl  whitespace-pre-line">
        {isLoading
          ? `Loading ${mediaType}...`
          : `There was an error loading the ${mediaType}!\n(${error?.message})`}
      </div>
    );
  }
  if (!media) {
    return <MediaMissing mediaId={mediaId} mediaType={mediaType} tmdb={tmdb} />;
  }
  setTitle(`${media.name} (${mediaType})`);

  return (
    <div>
      <div className="flex flex-row gap-8">
        <div className="flex-1 overflow-x-hidden">
          <MediaHeader media={media} />
          <EntrySection
            title="Synopsis"
            content={media.description || DEF_SYNOPSIS}
          />
          <div className="border-t border-gray-200 mt-3">
            {media.mediaType === MediaType.Film ? (
              <EntrySection
                title="Direction and Writing"
                crewContent={media.mergedCrew || UNKNOWN_CREW}
                peopleFilter={
                  media.mergedCrew
                    ? [AuthorType.Director, AuthorType.Writer]
                    : undefined
                }
              />
            ) : (
              <div>
                <EntrySection
                  title="Direction and Creation"
                  crewContent={media.mergedCrew || DEF_CREW_TV}
                  peopleFilter={
                    media.mergedCrew
                      ? [
                          AuthorType.Creator,
                          AuthorType.ExecProducer,
                          AuthorType.Director,
                          AuthorType.Writer,
                        ]
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-50">
          <MediaPoster media={media} />
        </div>
      </div>
      {media.mediaType === MediaType.Show && <SeasonsEntry show={media} />}
      <div className="mt-4 border-t border-gray-200">
        <EntrySection title="Cast" castContent={media.cast || UNKNOWN_CAST} />
      </div>
    </div>
  );
};

export default MediaEntry;
