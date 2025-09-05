import { JSX } from 'react';
import { buildTMDBorIMDBUrl } from '../../services/media-service';
import { MediaType } from '../../../../shared/types/media';

import { OptIconProps } from '../../types/common-props-types';
import IconIMDBLogo from '../Common/Icons/Logos/IconIMDBLogo';
import IconTMDBLogoVert from '../Common/Icons/Logos/IconTMDBLogoVert';

interface ExternalIconProps {
  tmdb: boolean;
  id: string | number | undefined;
  mediaType: MediaType;
}

const ExternalLogo = ({
  id,
  mediaType,
  tmdb,
}: ExternalIconProps): JSX.Element | null => {
  if (!id) {
    return null;
  }
  const logoProps: OptIconProps = {
    url: buildTMDBorIMDBUrl(mediaType, tmdb, id.toString()),
    newTab: true,
    title: `See on ${tmdb ? `TMDB` : 'IMDB'}`,
    width: 28,
    height: 20,
  };

  return (
    <>
      {(tmdb && <IconTMDBLogoVert {...logoProps} />) || (
        <IconIMDBLogo {...logoProps} />
      )}
    </>
  );
};

export default ExternalLogo;
