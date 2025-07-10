import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { buildTMDBUrl, buildOwnUrl } from '../../utils/url-helper';
import { MediaType } from '../../../../shared/types/media';
import { usePageInfoContext } from '../../hooks/use-page-info';
import { PageInfoContextValues } from '../../context/PageInfoProvider';

interface MissingMediaProps {
  mediaType: MediaType;
  mediaId: string | undefined;
  tmdb: boolean;
}

const MediaMissing = ({
  mediaType,
  mediaId,
  tmdb,
}: MissingMediaProps): JSX.Element | null => {
  const { setTitle }: PageInfoContextValues = usePageInfoContext();
  setTitle(`${mediaType} not found`);
  const idSource: string = tmdb ? 'TMDB' : 'WIAG';

  const notFound = (): JSX.Element => (
    <div className="font-medium text-2xl">
      {mediaType} doesn't exist in {idSource}'s database!
    </div>
  );

  if (!mediaId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        {notFound()}
      </div>
    );
  }
  const formatUrl: string = `/tmdb/${mediaType.toLocaleLowerCase()}`;
  const currentUrl: string = `${formatUrl}/${mediaId}`;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {notFound()}
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
            In this case: <Link to={currentUrl}>{buildOwnUrl(currentUrl)}</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaMissing;
