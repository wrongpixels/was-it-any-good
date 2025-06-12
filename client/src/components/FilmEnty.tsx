import { JSX, useEffect, useState } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { FilmResponse } from '../../../shared/types/models';
import { getById } from '../services/film';

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
    <div>
      <h2>{film.name}</h2>
    </div>
  );
};

export default FilmEntry;
