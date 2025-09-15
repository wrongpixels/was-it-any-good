import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { buildTMDBUrl, buildOwnUrl } from '../../utils/url-helper';
import { setTitle } from '../../utils/page-info-setter';
import { MediaType } from '../../../../shared/types/media';

interface MissingMediaProps {
  contentType: string;
  mediaType?: MediaType;
  mediaId?: string;
  tmdb?: boolean;
}

const MediaMissing = ({
  contentType,
  mediaId,
  mediaType,
  tmdb,
}: MissingMediaProps): JSX.Element | null => {
  setTitle(`${contentType} not found`);
  const idSource: string = tmdb ? 'TMDB' : 'WIAG';

  const notFound = (): JSX.Element => (
    <div className="font-medium text-2xl">
      {`${contentType} doesn't exist in ${idSource}'s database!`}
    </div>
  );

  if (!mediaId || !mediaType) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        {notFound()}
        <div className="text-gray-400">
          {'Are you sure you provided the correct id?'}
        </div>
      </div>
    );
  }
  const formatUrl: string = `/tmdb/${contentType.toLocaleLowerCase()}`;
  const currentUrl: string = `${formatUrl}/${mediaId}`;
  return (
    <div className="flex flex-col items-center justify-center gap-4  mt-8">
      {notFound()}
      {(tmdb && (
        <>
          <div>{'Do you want to check it yourself?'}</div>
          <div className="font-semibold">
            {'Click '}
            <Link to={buildTMDBUrl(mediaType, mediaId)}>{'Here'}</Link>
          </div>
        </>
      )) || (
        <>
          <div className="text-gray-500">
            {`Did you want to check a ${contentType} using a`}
            <span className="font-medium">{' TMDB '}</span>
            {'id?'}
          </div>
          <div>
            {'Use the format: '}
            <span className="font-bold">{`${formatUrl}/id`}</span>
          </div>
          <div className="pt-5 font-semibold text-lg">
            {'In this case: '}
            <Link to={currentUrl}>{buildOwnUrl(currentUrl)}</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaMissing;
