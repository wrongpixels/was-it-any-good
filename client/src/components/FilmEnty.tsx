import { JSX, useEffect, useState } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { FilmResponse } from '../../../shared/types/models';
import { getById } from '../services/film';

const FilmEntry = (): JSX.Element => {
  const [film, setFilm] = useState<FilmResponse | null>();
  const match: PathMatch<'id'> | null = useMatch('/film/:id');
  const filmId: string | undefined = match?.params.id;
  if (!filmId || filmId === undefined) {
    return <div>Invalid Film id!</div>;
  }
  useEffect(() => {
    const getFilm = async () => {
      const film: FilmResponse | null = await getById(filmId);
      setFilm(film);
    };
    getFilm();
  }, [filmId]);
  if (!film) {
    return <div>Film couldn't be found!</div>;
  }
  console.log(film.name);

  return (
    <div>
      <h1>Film: {film.id}</h1>
    </div>
  );
};

export default FilmEntry;
