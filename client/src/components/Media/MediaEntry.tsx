import { JSX } from 'react';
import EntrySection from '../EntrySection';
import { AuthorType } from '../../../../shared/types/roles';
import { MediaType } from '../../../../shared/types/media';
import MediaPoster from '../Poster/MediaPoster';
import MediaHeader from './MediaHeader';
import SeasonsEntry from './SeasonsEntry';
import { Link, PathMatch, useMatch } from 'react-router-dom';
import { buildMediaURL } from '../../services/media-service';
import { useMediaQuery } from '../../queries/media-queries';
import { buildOwnUrl, buildTMDBUrl } from '../../utils/url-helper';
import { usePrefetchRating } from '../../queries/ratings-queries';

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
  usePrefetchRating(mediaId, mediaType);
  const {
    data: media,
    isLoading,
    isError,
    error,
  } = tmdb
    ? useMediaQuery({ mediaType, tmdbId: mediaId })
    : useMediaQuery({ mediaType, id: mediaId });

  if (isLoading || isError) {
    return (
      <div className="flex justify-center w-full font-medium text-xl">
        {isLoading
          ? `Loading ${mediaType}...`
          : `There was an error loading the ${mediaType} ${error?.message}`}
      </div>
    );
  }
  if (!mediaId || !media) {
    const formatUrl: string = `/tmdb/${mediaType.toLocaleLowerCase()}`;
    const currentUrl: string = `${formatUrl}/${mediaId}`;
    const idSource: string = tmdb ? 'TMDB' : 'WIAG';
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="font-medium text-2xl">
          {mediaType} doesn't exist in {idSource}'s database!
        </div>
        {(tmdb && (
          <>
            <div>Do you want to check it yourself?</div>
            <div className="font-semibold">
              Click <a href={buildTMDBUrl(mediaType, mediaId)}>Here</a>
            </div>
          </>
        )) || (
          <>
            <div>
              Did you want to check a {mediaType} using a
              <span className="font-medium"> TMDB </span>id?
            </div>
            <div>
              Use the format:{' '}
              <span className="font-bold">{`${formatUrl}/id`}</span>
            </div>
            <div className="pt-5 font-semibold text-lg">
              In this case:{' '}
              <Link to={currentUrl}>{buildOwnUrl(currentUrl)}</Link>
            </div>
          </>
        )}
      </div>
    );
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
