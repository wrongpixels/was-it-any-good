import imageLinker from '../services/image-linker';
import {
  TMDBAcceptedJobs,
  TMDBAcceptedDepartments,
  TMDBCrewData,
  TMDBRoleData,
  TMDBStudioData,
  TMDBMediaData,
  isShow,
} from '../schemas/tmdb-media-schema';
import {
  DEF_ROLE,
  DEF_DIRECTOR,
  DEF_WRITER,
  DEF_STUDIO,
  DEF_PRODUCER,
  DEF_COMPOSER,
  DEF_FILM,
} from '../constants/media-defaults';
import {
  IndividualData,
  RoleData,
  RoleType,
  AuthorData,
  StudioData,
  TMDBData,
} from '../types/media/media-types';
import { mapTMDBGenres } from '../services/genre-mapper';
import { createCreators, createIndexForShowBulk } from './show-factory';
import { TMDBCreatorData } from '../schemas/tmdb-show-schema';
import { CountryCode, isCountryCode } from '../../../shared/types/countries';
import {
  TMDBIndexFilm,
  TMDBIndexMedia,
  TMDBIndexShow,
} from '../schemas/tmdb-index-media-schemas';
import { DEF_IMAGE_PERSON } from '../../../shared/defaults/media-defaults';
import { CreateIndexMedia } from '../../../shared/types/models';
import { createIndexForFilmBulk } from './film-factory';

export const createTMDBIndexBase = (tmdb: TMDBIndexMedia | TMDBMediaData) => ({
  tmdbId: tmdb.id,
  baseRating: Number(tmdb.vote_average),
  country: validateCountries(tmdb.origin_country),
  rating: 0,
  popularity: tmdb.popularity,
  voteCount: tmdb.vote_average > 0 ? 1 : 0,
  image: tmdb.poster_path
    ? imageLinker.createPosterURL(tmdb.poster_path)
    : DEF_FILM.image,
});

export const createIndexForMediaBulk = (
  tmdbFilms: TMDBIndexFilm[],
  tmdbShows: TMDBIndexShow[]
): CreateIndexMedia[] => [
  ...createIndexForFilmBulk(tmdbFilms),
  ...createIndexForShowBulk(tmdbShows),
];

export const createTMDBMediaBase = (tmdb: TMDBMediaData): TMDBData => ({
  ...createTMDBIndexBase(tmdb),
  countries: validateCountries(tmdb.origin_country),
  imdbId: tmdb.imdb_id,
  description: tmdb.overview,
  genres: mapTMDBGenres(
    tmdb.genres
    //    isShow(tmdb) ? MediaType.Show : MediaType.Film
  ),
  cast: createCast(tmdb.credits.cast),
  crew: getCrew(tmdb),
  studios: createStudios(tmdb.production_companies),
});

export const getCrew = (tmdb: TMDBMediaData): AuthorData[] => {
  if (isShow(tmdb)) {
    return [
      ...createCrew(tmdb.credits.crew),
      ...createCreators(tmdb.created_by),
    ];
  }
  return createCrew(tmdb.credits.crew);
};

export const getAirDate = (date: string | null | undefined): string | null => {
  if (!date) {
    return null;
  }
  const parsed = new Date(date);
  const isValid = !isNaN(parsed.getTime());
  return isValid ? date : null;
};
export const validateCountry = (code: string): CountryCode => {
  if (isCountryCode(code)) {
    return code;
  }
  return 'UNKNOWN';
};

export const validateCountries = (codes: string[]): CountryCode[] => {
  if (!codes || codes.length === 0) {
    return ['UNKNOWN'];
  }
  return codes.map((c: string) => validateCountry(c));
};

export const createStudio = (studio: TMDBStudioData): StudioData => ({
  ...DEF_STUDIO,
  image: studio.logo_path
    ? imageLinker.createStudioImageURL(studio.logo_path)
    : DEF_STUDIO.image,
  country: validateCountry(studio.origin_country) || undefined,
  name: studio.name,
  tmdbId: studio.id,
});

export const createStudios = (studios: TMDBStudioData[]): StudioData[] => {
  const trimmedStudios: TMDBStudioData[] = studios.slice(0, 3);
  return trimmedStudios.map((s: TMDBStudioData) => createStudio(s));
};

export const createCrew = (crewData: TMDBCrewData[]): AuthorData[] => {
  return crewData
    .map((c: TMDBCrewData) => {
      switch (c.job) {
        case TMDBAcceptedJobs.Director:
          return createDirector(c);
        case TMDBAcceptedJobs.Producer:
          return createProducer(c);
        case TMDBAcceptedJobs.ExecutiveProducer:
          return createProducer(c);
        case TMDBAcceptedJobs.OriginalMusicComposer:
          return createComposer(c);
        case TMDBAcceptedJobs.Screenplay:
          return createWriter(c);
        default:
          return null;
      }
    })
    .filter((c: AuthorData | null): c is AuthorData => c !== null);
};

export const createCrewMember = (
  crewMember: TMDBCrewData | TMDBCreatorData
): IndividualData => ({
  name: crewMember.name,
  image: crewMember.profile_path
    ? imageLinker.createAvatarURL(crewMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: crewMember.id,
});

export const createDirector = (crewMember: TMDBCrewData): AuthorData => ({
  ...DEF_DIRECTOR,
  ...createCrewMember(crewMember),
});

export const createWriter = (crewMember: TMDBCrewData): AuthorData => ({
  ...DEF_WRITER,
  ...createCrewMember(crewMember),
});

export const createProducer = (crewMember: TMDBCrewData): AuthorData => ({
  ...DEF_PRODUCER,
  ...createCrewMember(crewMember),
});

export const createComposer = (crewMember: TMDBCrewData): AuthorData => ({
  ...DEF_COMPOSER,
  ...createCrewMember(crewMember),
});

export const createCast = (cast: TMDBRoleData[]): RoleData[] => {
  const filteredCast: TMDBRoleData[] = cast.filter(
    (c: TMDBRoleData) =>
      c.known_for_department === TMDBAcceptedDepartments.Acting
  );
  const combinedRoleMap = new Map<string, RoleData>();
  filteredCast.forEach((c: TMDBRoleData) => {
    const key: string = `${c.id}`;
    const entry: RoleData | undefined = combinedRoleMap.get(key);
    if (entry) {
      combinedRoleMap.set(key, {
        ...entry,
        character: entry.character.concat(c.character),
      });
      return;
    }
    combinedRoleMap.set(key, createRole(c));
  });
  return Array.from(combinedRoleMap.values());
};

export const createRole = (castMember: TMDBRoleData): RoleData => ({
  ...DEF_ROLE,
  name: castMember.name,
  order: castMember.order,
  image: castMember.profile_path
    ? imageLinker.createAvatarURL(castMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: castMember.id,
  character: castMember.character ? [castMember.character] : [''],
  roleType: RoleType.Main,
});
