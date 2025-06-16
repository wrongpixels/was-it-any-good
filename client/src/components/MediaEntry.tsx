import { JSX, useEffect, useState } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { FilmResponse } from '../../../shared/types/models';
import { getById, getByTMDBId } from '../services/film';
import { getYear } from '../utils/format-helper';
import MediaFlags from './MediaFlags';
import EntrySection from './EntrySection';
import { AuthorType } from '../../../shared/types/roles';
import mergeCredits from '../utils/credits-merger';
import GenreSection from './GenreList';
import StarRating from './StarRating';
import { MediaType } from '../../../shared/types/media';

interface MediaEntryProps {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaEntry = ({
  tmdb = false,
  mediaType,
}: MediaEntryProps): JSX.Element => {
  const [media, setMedia] = useState<FilmResponse | null | undefined>(
    undefined
  );
  const match: PathMatch<'id'> | null = useMatch(
    `${tmdb ? '/tmdb' : mediaType === MediaType.Film ? '/film' : mediaType === MediaType.Show ? '/show' : '/game'}/:id`
  );
  const filmId: string | undefined = match?.params.id;
  useEffect(() => {
    if (!filmId) {
      return;
    }
    const getFilm = async () => {
      const filmResponse: FilmResponse | null = tmdb
        ? await getByTMDBId(filmId)
        : await getById(filmId);
      if (filmResponse) {
        setMedia(
          filmResponse.crew
            ? { ...filmResponse, mergedCrew: mergeCredits(filmResponse.crew) }
            : filmResponse
        );
      } else {
        setMedia(null);
      }
    };
    getFilm();
  }, [filmId]);
  if (!filmId) {
    return <div>Invalid Film id!</div>;
  }
  if (media === undefined || !media) {
    return (
      <div className="flex justify-center w-full h-full font-medium">
        {media === undefined ? 'Loading...' : `Film couldn't be found!`}
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-row gap-8">
        <div className="flex-1">
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
            <span>
              {media.genres && <GenreSection genres={media.genres} />}
            </span>
          </div>
          <EntrySection title="Synopsis" content={media.description} />
          <div className="border-t border-gray-200 mt-3">
            <EntrySection
              title="Direction and Writing"
              crewContent={media.mergedCrew}
              peopleFilter={[AuthorType.Director, AuthorType.Writer]}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded border border-9 border-white ring-1 ring-gray-300 self-start">
          <img
            src={media.image}
            alt={media.name}
            title={media.name}
            className="w-45 rounded shadow ring-1 ring-gray-300"
            loading="lazy"
          />
          <div className="text-center">
            <StarRating rating={media.baseRating} valid={true} />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200">
        <EntrySection title="Cast" castContent={media.cast} />
      </div>
    </div>
  );
};

export default MediaEntry;
