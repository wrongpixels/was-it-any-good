import { JSX } from 'react';
import { MediaResponse, SeasonResponse } from '../../../shared/types/models';
import { buildTMDBorIMDBUrl } from '../services/media-service';
import { MediaType } from '../../../shared/types/media';

interface PropsStarRating {
  media: MediaResponse | SeasonResponse;
  mediaType: MediaType;
  rating: number;
  valid?: boolean;
  season?: boolean;
}

const STARS: string = '★★★★★';

const StarRating = ({
  rating,
  valid = true,
  season = false,
  media,
  mediaType,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  return (
    <div
      className={`relative inline-block ${season ? 'text-2xl' : 'text-3xl'}`}
    >
      <div className="text-gray-300">{STARS}</div>
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${rating * 10}%` }}
      >
        <div className="text-[#6d90cf]">{STARS}</div>
      </div>
      {valid && rating > 0 ? (
        <div className="relative">
          {!season && media.tmdbId && (
            <a
              href={buildTMDBorIMDBUrl(mediaType, true, media.tmdbId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
                title="See on TMDB"
                loading="lazy"
                className="w-7 absolute -left-3 top-1 opacity-70"
              />
            </a>
          )}
          <span
            className={`${season ? 'text-xl' : 'text-2xl'} font-bold text-gray-500`}
          >
            {rating}
          </span>
          {!season && media.imdbId && (
            <a
              href={buildTMDBorIMDBUrl(mediaType, false, media.imdbId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://m.media-amazon.com/images/G/01/IMDb/brand/guidelines/imdb/IMDb_Logo_Rectangle_Gold._CB443386186_.png"
                title="See on IMDB"
                loading="lazy"
                className="w-7 absolute -right-3 top-1 opacity-80"
              />
            </a>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 pt-1 pb-1 italic">
          Not enough ratings
        </div>
      )}
    </div>
  );
};

export default StarRating;
