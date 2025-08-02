import { JSX } from 'react';
import { buildTMDBorIMDBUrl } from '../../services/media-service';
import { MediaType } from '../../../../shared/types/media';
import IMDBLogo from '../common/icons/IMDBLogo';
import { OptIconProps } from '../../types/common-props-types';
import TMDBLogoVer from '../common/icons/TMDB/TMDBLogoVer';

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
      {(tmdb && <TMDBLogoVer {...logoProps} />) || <IMDBLogo {...logoProps} />}
    </>
  );
};

export default ExternalLogo;
