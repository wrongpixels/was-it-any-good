import {
  TMDBAcceptedJobs,
  TMDBAcceptedDepartments,
  TMDBCrewData,
  TMDBFilmData,
  TMDBRoleData,
  TMDBStudioData,
} from '../schemas/film-schema';
import { mapTMDBGenres } from '../services/genre-mapper';
import Country from '../types/countries/country-types';
import {
  DEF_ROLE,
  DEF_DIRECTOR,
  DEF_FILM,
  DEF_IMAGE_PERSON,
  DEF_WRITER,
  DEF_STUDIO,
} from '../types/media/media-defaults';
import {
  FilmData,
  DirectorData,
  IndividualData,
  ReleaseDate,
  RoleData,
  RoleType,
  WriterData,
  StudioData,
} from '../types/media/media-types';

const MEDIA_URL = 'https://media.themoviedb.org/t/p';

const AVATAR_URL: string = `${MEDIA_URL}/w138_and_h175_face`;
const POSTER_URL: string = `${MEDIA_URL}/w220_and_h330_face`;
const STUDIO_URL: string = `${MEDIA_URL}/w200`;

const createAvatarURL = (path: string): string => `${AVATAR_URL}${path}`;
const createPosterURL = (path: string): string => `${POSTER_URL}${path}`;
const createStudioImageURL = (path: string): string => `${STUDIO_URL}${path}`;

export const createFilm = (tmdb: TMDBFilmData): FilmData => ({
  ...DEF_FILM,
  tmdbId: tmdb.id.toString(),
  imdbId: tmdb.imdb_id,
  name: tmdb.title,
  sortName: tmdb.title.trim(),
  countries: validateCountries(tmdb.origin_country),
  originalName: tmdb.original_title,
  description: tmdb.overview,
  releaseDate: getReleaseDate(tmdb.release_date),
  image: tmdb.poster_path ? createPosterURL(tmdb.poster_path) : DEF_FILM.image,
  runtime: tmdb.runtime,
  genres: mapTMDBGenres(tmdb.genres),
  directors: createDirectors(tmdb.credits.crew),
  writers: createWriters(tmdb.credits.crew),
  cast: createCast(tmdb.credits.cast),
  studios: createStudios(tmdb.production_companies),
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
  return Object.keys(Country).includes(code as Country)
    ? (code as Country)
    : null;
};

const validateCountries = (codes: string[]): Country[] => {
  console.log(codes);
  return codes
    .map((c: string) => validateCountry(c))
    .filter((c): c is Country => c !== null);
};

const createWriter = (crewMember: TMDBCrewData): WriterData => ({
  ...DEF_WRITER,
  ...createCrew(crewMember),
});

const createWriters = (crew: TMDBCrewData[]): WriterData[] => {
  const writers: TMDBCrewData[] = crew.filter(
    (c: TMDBCrewData) => c.department === TMDBAcceptedDepartments.Writing
  );
  return writers.map((w: TMDBCrewData) => createWriter(w));
};

const createStudio = (studio: TMDBStudioData): StudioData => ({
  ...DEF_STUDIO,
  image: studio.logo_path
    ? createStudioImageURL(studio.logo_path)
    : DEF_STUDIO.image,
  country: validateCountry(studio.origin_country) || undefined,
  name: studio.name,
  tmdbId: studio.id.toString(),
});

const createStudios = (studios: TMDBStudioData[]): StudioData[] => {
  const trimmedStudios: TMDBStudioData[] = studios.slice(0, 3);
  return trimmedStudios.map((s: TMDBStudioData) => createStudio(s));
};

const createDirector = (crewMember: TMDBCrewData): DirectorData => ({
  ...DEF_DIRECTOR,
  ...createCrew(crewMember),
});

const createDirectors = (crew: TMDBCrewData[]): DirectorData[] => {
  const directors: TMDBCrewData[] = crew.filter(
    (c: TMDBCrewData) => c.job === TMDBAcceptedJobs.Director
  );
  return directors.map((d: TMDBCrewData) => createDirector(d));
};

const createCast = (cast: TMDBRoleData[]): RoleData[] => {
  const filteredCast: TMDBRoleData[] = cast.filter(
    (c: TMDBRoleData) =>
      c.known_for_department === TMDBAcceptedDepartments.Acting
  );
  return filteredCast.map((c: TMDBRoleData) => createRole(c));
};

const createCrew = (crewMember: TMDBCrewData): IndividualData => ({
  name: crewMember.name,
  image: crewMember.profile_path
    ? createAvatarURL(crewMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: crewMember.id.toString(),
});

const createRole = (castMember: TMDBRoleData): RoleData => ({
  ...DEF_ROLE,
  name: castMember.name,
  image: castMember.profile_path
    ? createAvatarURL(castMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: castMember.id.toString(),
  character: castMember.character || '',
  roleType: RoleType.Main,
});
