import {
  TMDBAcceptedJobs,
  TMDBAcceptedDepartments,
  TMDBCreditsData,
  TMDBCrewData,
  TMDBFilmData,
  TMDBRoleData,
} from '../schemas/film-schema';
import { mapTMDBGenres } from '../services/genre-mapper';
import Country from '../types/countries/country-types';
import {
  DEF_ROLE,
  DEF_DIRECTOR,
  DEF_FILM,
  DEF_IMAGE_PERSON,
} from '../types/media/media-defaults';
import {
  FilmData,
  DirectorData,
  IndividualData,
  ReleaseDate,
  RoleData,
  RoleType,
} from '../types/media/media-types';

const AVATAR_URL: string =
  'https://media.themoviedb.org/t/p/w138_and_h175_face/';

export const createFilm = (tmdb: TMDBFilmData): FilmData => ({
  ...DEF_FILM,
  tmdbId: tmdb.id,
  name: tmdb.title,
  sortName: tmdb.title.trim(),
  countries: validateCountries(tmdb.origin_country),
  originalName: tmdb.original_title,
  description: tmdb.overview,
  releaseDate: getReleaseDate(tmdb.release_date),
  image: tmdb.poster_path || '',
  runtime: tmdb.runtime,
  genres: mapTMDBGenres(tmdb.genres),
  directors: createDirectors(tmdb.credits),
  cast: createCast(tmdb.credits),
});

const getReleaseDate = (date: string): ReleaseDate => {
  const parsed = new Date(date);
  const isValid = !isNaN(parsed.getTime());
  return {
    isUnknown: !isValid,
    date,
  };
};
const validateCountry = (code: string): Country | null => {
  return Object.values(Country).includes(code as Country)
    ? (code as Country)
    : null;
};

const validateCountries = (codes: string[]): Country[] =>
  codes
    .map((c: string) => validateCountry(c))
    .filter((c): c is Country => c !== null);

const createImageURL = (path: string): string => `${AVATAR_URL}${path}`;

const createDirectors = (credits: TMDBCreditsData): DirectorData[] => {
  const directors: TMDBCrewData[] = credits.crew.filter(
    (c: TMDBCrewData) => c.job === TMDBAcceptedJobs.Director
  );
  return directors.map((d: TMDBCrewData) => createDirector(d));
};

const createCast = (credits: TMDBCreditsData): RoleData[] => {
  const cast: TMDBRoleData[] = credits.cast.filter(
    (c: TMDBRoleData) =>
      c.known_for_department === TMDBAcceptedDepartments.Acting
  );
  return cast.map((c: TMDBRoleData) => createRole(c));
};

const createCrew = (crewMember: TMDBCrewData): IndividualData => ({
  name: crewMember.name,
  image: crewMember.profile_path
    ? createImageURL(crewMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: crewMember.id,
});

const createRole = (castMember: TMDBRoleData): RoleData => ({
  ...DEF_ROLE,
  name: castMember.name,
  image: castMember.profile_path
    ? createImageURL(castMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: castMember.id,
  character: castMember.character || '',
  roleType: RoleType.Main,
});

const createDirector = (crewMember: TMDBCrewData): DirectorData => ({
  ...DEF_DIRECTOR,
  ...createCrew(crewMember),
});
