import { JSX, useEffect, useState } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { FilmResponse } from '../../../shared/types/models';
import { getById } from '../services/film';
import { getYear } from '../utils/format-helper';
import MediaFlags from './MediaFlags';

const FilmEntry = (): JSX.Element => {
  const [film, setFilm] = useState<FilmResponse | null | undefined>(undefined);
  const match: PathMatch<'id'> | null = useMatch('/film/:id');
  const filmId: string | undefined = match?.params.id;
  useEffect(() => {
    if (!filmId) {
      return;
    }
    const getFilm = async () => {
      const filmResponse: FilmResponse | null = await getById(filmId);
      setFilm(filmResponse);
    };
    getFilm();
  }, [filmId]);
  if (!filmId) {
    return <div>Invalid Film id!</div>;
  }
  if (film === undefined) {
    return <div>Loading...</div>;
  }
  if (!film) {
    return <div>Film couldn't be found!</div>;
  }
  return (
    <div className="flex flex-row gap-8 p-4 bg-white rounded shadow max-w-2xl">
      <div className="flex-1">
        <h2 className="text-xl flex items-center gap-2 border-b border-gray-200 pb-3 mb-3">
          <b>{film.name}</b>
          <span className="text-gray-400">{getYear(film.releaseDate)}</span>
          <MediaFlags countryCodes={film.country} />
        </h2>
        <div className="mt-4 space-y-2">
          <b className="block text-lg">Synopsis</b>
          <p className="text-gray-700 text-sm leading-relaxed text-justify">
            {film.description}
          </p>
        </div>
      </div>

      <div>
        <img src={film.image} alt={film.name} className="w-45 rounded" />
      </div>
    </div>
  );
};

export default FilmEntry;
