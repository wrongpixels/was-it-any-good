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
  useMediaByIDQuery,
  useMediaByTMDBQuery,
} from '../../queries/media-queries';

interface MediaEntryProps {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaEntry = ({
  tmdb = false,
  mediaType,
}: MediaEntryProps): JSX.Element => {
  const match: PathMatch<'id'> | null = useMatch(
    `${buildMediaURL(mediaType, tmdb)}/:id`
  );
  const mediaId: string | undefined = match?.params.id;
  const {
    data: media,
    isLoading,
    isError,
  } = tmdb
    ? useMediaByTMDBQuery(mediaId, mediaType)
    : useMediaByIDQuery(mediaId, mediaType);

  if (isLoading || isError) {
    return (
      <div className="flex justify-center w-full h-full font-medium">
        {isLoading
          ? `Loading ${mediaType}...`
          : `${mediaType} couldn't be found!`}
      </div>
    );
  }
  if (!mediaId || !media) {
    return <div>Invalid {mediaType} id!</div>;
  }
  return (
    <div>
      <div className="flex flex-row gap-8">
        <div className="flex-1 overflow-x-hidden">
          <MediaHeader media={media} />
          <EntrySection title="Synopsis" content={media.description} />
          <div className="border-t border-gray-200 mt-3">
            {media.mediaType === MediaType.Film ? (
              <EntrySection
                title="Direction and Writing"
                crewContent={media.mergedCrew}
                peopleFilter={[AuthorType.Director, AuthorType.Writer]}
              />
            ) : (
              <div>
                <EntrySection
                  title="Direction and Creation"
                  crewContent={media.mergedCrew}
                  peopleFilter={[
                    AuthorType.Creator,
                    AuthorType.ExecProducer,
                    AuthorType.Director,
                    AuthorType.Writer,
                  ]}
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
        <EntrySection title="Cast" castContent={media.cast} />
      </div>
    </div>
  );
};

export default MediaEntry;
