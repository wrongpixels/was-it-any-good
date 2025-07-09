import { JSX } from 'react';
import { buildTMDBorIMDBUrl } from '../../services/media-service';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';

const TMDB_LOGO_URL: string =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg';

const IMDB_LOGO_URL: string =
  'https://m.media-amazon.com/images/G/01/IMDb/brand/guidelines/imdb/IMDb_Logo_Rectangle_Gold._CB443386186_.png';

const getLogo = (tmdb: boolean): string =>
  tmdb ? TMDB_LOGO_URL : IMDB_LOGO_URL;

interface ExternalIconProps {
  tmdb: boolean;
  media: MediaResponse | SeasonResponse;
  mediaType: MediaType;
}

const ExternalLogo = ({
  media,
  mediaType,
  tmdb,
}: ExternalIconProps): JSX.Element => {
  return (
    <>
      {(tmdb ? media.tmdbId : media.imdbId) && (
        <a
          href={buildTMDBorIMDBUrl(
            mediaType,
            tmdb,
            tmdb ? media.tmdbId?.toString() : media.imdbId
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={getLogo(tmdb)}
            title={`See on ${tmdb ? `TMDB` : 'IMDB'}`}
            loading="lazy"
          />
        </a>
      )}
    </>
  );
};

export default ExternalLogo;
