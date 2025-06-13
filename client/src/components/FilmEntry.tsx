import { JSX, useEffect, useState } from "react";
import { PathMatch, useMatch } from "react-router-dom";
import { FilmResponse } from "../../../shared/types/models";
import { getById } from "../services/film";
import { getYear } from "../utils/format-helper";
import MediaFlags from "./MediaFlags";
import EntrySection from "./EntrySection";
import { AuthorType } from "../../../shared/types/roles";

const FilmEntry = (): JSX.Element => {
  const [film, setFilm] = useState<FilmResponse | null | undefined>(undefined);
  const match: PathMatch<"id"> | null = useMatch("/film/:id");
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
    <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto">
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-3xl flex items-center gap-2 border-b border-gray-200 pb-3 mb-3">
            <span className="font-medium">{film.name}</span>
            <span className="text-gray-400">{getYear(film.releaseDate)}</span>
            <MediaFlags countryCodes={film.country} />
          </h2>
          {film.originalName && film.originalName !== film.name && (
            <span className="text-gray-400 text-sm font-italic">
              {film.originalName}
            </span>
          )}

          <EntrySection title="Synopsis" content={film.description} />
        </div>

        <div>
          <img
            src={film.image}
            alt={film.name}
            title={film.name}
            className="w-45 rounded shadow-md border border-neutral-300"
            loading="lazy"
          />
        </div>
      </div>
      <EntrySection
        title="Direction"
        peopleContent={film.crew}
        peopleFilter={AuthorType.Director}
      />
      <EntrySection title="Cast" peopleContent={film.cast} />
    </div>
  );
};

export default FilmEntry;
