import imageLinker from '../services/image-linker';
import {
  TMDBAcceptedJobs,
  TMDBAcceptedDepartments,
  TMDBCrewData,
  TMDBRoleData,
  TMDBStudioData,
} from '../schemas/film-schema';
import Country from '../types/countries/country-types';
import {
  DEF_ROLE,
  DEF_DIRECTOR,
  DEF_IMAGE_PERSON,
  DEF_WRITER,
  DEF_STUDIO,
} from '../types/media/media-defaults';
import {
  DirectorData,
  IndividualData,
  AirDate,
  RoleData,
  RoleType,
  WriterData,
  StudioData,
} from '../types/media/media-types';

export const getAirDate = (date: string): AirDate => {
  const parsed = new Date(date);
  const isValid = !isNaN(parsed.getTime());
  return {
    isUnknown: !isValid,
    date,
  };
};
export const validateCountry = (code: string): Country | null => {
  return Object.keys(Country).includes(code as Country)
    ? (code as Country)
    : null;
};

export const validateCountries = (codes: string[]): Country[] => {
  console.log(codes);
  return codes
    .map((c: string) => validateCountry(c))
    .filter((c): c is Country => c !== null);
};

export const createWriter = (crewMember: TMDBCrewData): WriterData => ({
  ...DEF_WRITER,
  ...createCrew(crewMember),
});

export const createWriters = (crew: TMDBCrewData[]): WriterData[] => {
  const writers: TMDBCrewData[] = crew.filter(
    (c: TMDBCrewData) => c.department === TMDBAcceptedDepartments.Writing
  );
  return writers.map((w: TMDBCrewData) => createWriter(w));
};

export const createStudio = (studio: TMDBStudioData): StudioData => ({
  ...DEF_STUDIO,
  image: studio.logo_path
    ? imageLinker.createStudioImageURL(studio.logo_path)
    : DEF_STUDIO.image,
  country: validateCountry(studio.origin_country) || undefined,
  name: studio.name,
  tmdbId: studio.id.toString(),
});

export const createStudios = (studios: TMDBStudioData[]): StudioData[] => {
  const trimmedStudios: TMDBStudioData[] = studios.slice(0, 3);
  return trimmedStudios.map((s: TMDBStudioData) => createStudio(s));
};

export const createDirector = (crewMember: TMDBCrewData): DirectorData => ({
  ...DEF_DIRECTOR,
  ...createCrew(crewMember),
});

export const createDirectors = (crew: TMDBCrewData[]): DirectorData[] => {
  const directors: TMDBCrewData[] = crew.filter(
    (c: TMDBCrewData) => c.job === TMDBAcceptedJobs.Director
  );
  return directors.map((d: TMDBCrewData) => createDirector(d));
};

export const createCast = (cast: TMDBRoleData[]): RoleData[] => {
  const filteredCast: TMDBRoleData[] = cast.filter(
    (c: TMDBRoleData) =>
      c.known_for_department === TMDBAcceptedDepartments.Acting
  );
  return filteredCast.map((c: TMDBRoleData) => createRole(c));
};

export const createCrew = (crewMember: TMDBCrewData): IndividualData => ({
  name: crewMember.name,
  image: crewMember.profile_path
    ? imageLinker.createAvatarURL(crewMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: crewMember.id.toString(),
});

export const createRole = (castMember: TMDBRoleData): RoleData => ({
  ...DEF_ROLE,
  name: castMember.name,
  image: castMember.profile_path
    ? imageLinker.createAvatarURL(castMember.profile_path)
    : DEF_IMAGE_PERSON,
  tmdbId: castMember.id.toString(),
  character: castMember.character || '',
  roleType: RoleType.Main,
});
