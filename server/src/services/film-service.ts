import { createFilm } from '../factories/film-factory';
import { CreateFilm } from '../models/film';
import MediaRole, { CreateMediaRole } from '../models/mediaRole';
import Person, { CreatePerson } from '../models/person';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCreditsSchema,
  TMDBCrewData,
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
} from '../schemas/film-schema';
import Country from '../types/countries/country-types';
import {
  AuthorData,
  AuthorType,
  FilmData,
  MediaPerson,
  MediaType,
  RoleData,
} from '../types/media/media-types';
import { tmdbAPI } from '../util/config';

export const fetchFilm = async (id: string): Promise<FilmData> => {
  const filmRes = await tmdbAPI.get(`/movie/${id}`);
  const creditsRes = await tmdbAPI.get(`/movie/${id}/credits`);

  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);

  return actualFilmData;
};

const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});

export const buildFilm = (filmData: FilmData): CreateFilm => ({
  imdbId: filmData.imdbId,
  tmdbId: filmData.tmdbId,
  name: filmData.name,
  originalName: filmData.originalName,
  sortName: filmData.sortName,
  description: filmData.description,
  status: filmData.status,
  releaseDate: filmData.releaseDate.date || 'Unknown',
  country: filmData.countries,
  image: filmData.image,
  rating: 0,
  voteCount: 0,
  runtime: filmData.runtime,
  parentalGuide: null,
});

export const buildCredits = async (
  filmData: FilmData,
  mediaId: number
): Promise<MediaRole[] | null> => {
  const cast: MediaRole[] | null = await buildCast(
    filmData.cast,
    mediaId,
    filmData.type
  );
  const crew: MediaRole[] | null = await buildCrew(
    filmData.crew,
    mediaId,
    filmData.type
  );
  const combinedCredits = [...(cast || []), ...(crew || [])];
  return combinedCredits.length > 0 ? combinedCredits : null;
};

const buildCast = async (
  cast: RoleData[],
  mediaId: number,
  mediaType: MediaType
): Promise<MediaRole[] | null> => {
  const roles: (MediaRole | null)[] = await Promise.all(
    cast.map((roleData) => buildPersonAndRole(roleData, mediaId, mediaType))
  );
  const validRoles = roles.filter((role): role is MediaRole => role !== null);
  return validRoles.length > 0 ? validRoles : null;
};

const buildCrew = async (
  crew: AuthorData[],
  mediaId: number,
  mediaType: MediaType
): Promise<MediaRole[] | null> => {
  const roles: (MediaRole | null)[] = await Promise.all(
    crew.map((authorData) => buildPersonAndRole(authorData, mediaId, mediaType))
  );
  const validRoles = roles.filter((role): role is MediaRole => role !== null);
  return validRoles.length > 0 ? validRoles : null;
};

const buildPersonAndRole = async (
  mediaPersonData: MediaPerson,
  mediaId: number,
  mediaType: MediaType
): Promise<MediaRole | null> => {
  if (!mediaPersonData) {
    return null;
  }
  const personData: CreatePerson = {
    name: mediaPersonData.name,
    tmdbId: mediaPersonData.tmdbId,
    image: mediaPersonData.image,
    country: mediaPersonData.country
      ? [mediaPersonData.country]
      : [Country.UNKNOWN],
  };
  const person: Person | null = await getOrCreatePerson(personData);
  if (!person) {
    return null;
  }
  const roleData: CreateMediaRole = {
    personId: person.id,
    mediaId,
    mediaType,
    role: mediaPersonData.type,
  };
  if (
    mediaPersonData.type === AuthorType.Actor &&
    'character' in mediaPersonData &&
    'order' in mediaPersonData
  ) {
    roleData.characterName = [mediaPersonData.character];
    roleData.order = mediaPersonData.order;
  }
  return await buildMediaRole(roleData);
};

const buildMediaRole = async (
  roleData: CreateMediaRole
): Promise<MediaRole | null> => {
  const mediaRole: MediaRole | null = await getOrCreateMediaRole(roleData);
  if (mediaRole === null) {
    return null;
  }
  if (mediaRole.role === AuthorType.Actor) {
    if (!roleData.characterName || roleData.characterName.length < 1) {
      return null;
    }
    let changed: boolean = false;
    if (!mediaRole.characterName || mediaRole.characterName.length < 1) {
      mediaRole.characterName = roleData.characterName;
      changed = true;
    } else {
      if (!mediaRole.characterName.includes(roleData.characterName[0])) {
        mediaRole.characterName.push(roleData.characterName[0]);
        changed = true;
        console.log(
          `Added character ${roleData.characterName[0]} to Media Role ${mediaRole.id}`
        );
      }
    }
    if (changed) {
      await mediaRole.save();
    }
  }
  return mediaRole;
};

export const getOrCreatePerson = async (
  defaults: CreatePerson
): Promise<Person | null> => {
  if (!defaults || !defaults.tmdbId || !defaults.name) {
    return null;
  }
  try {
    const person: [Person, boolean] = await Person.findOrCreate({
      where: {
        tmdbId: defaults.tmdbId,
      },
      defaults,
    });
    if (!person) {
      return null;
    }
    if (person[1]) {
      console.log(`Created Person ${person[0].name} ${person[0].id}`);
    }
    return person[0];
  } catch (_error) {
    console.log(_error);
    return null;
  }
};

export const getOrCreateMediaRole = async (
  defaults: CreateMediaRole
): Promise<MediaRole | null> => {
  if (!defaults || !defaults.mediaId || !defaults.personId || !defaults.role) {
    return null;
  }
  try {
    const role: [MediaRole, boolean] = await MediaRole.findOrCreate({
      where: {
        mediaId: defaults.mediaId,
        personId: defaults.personId,
        role: defaults.role,
      },
      defaults,
      include: {
        model: Person,
        as: 'person',
        attributes: ['name'],
      },
    });
    if (!role) {
      console.log('No role was created.');
      return null;
    }
    if (role[1]) {
      console.log(`Created Film Media Role ${role[0].id}`);
    }
    return role[0];
  } catch (error) {
    console.error(
      `Failed to create/find MediaRole for filmId=${defaults.mediaId}, personId=${defaults.personId}, role=${defaults.role}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
};
