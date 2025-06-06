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
  AuthorType,
  FilmData,
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

export const buildCast = async (
  cast: RoleData[],
  mediaId: number,
  mediaType: MediaType
): Promise<MediaRole[]> => {
  const roles: (MediaRole | null)[] = await Promise.all(
    cast.map((castRole) => buildPersonAndRole(castRole, mediaId, mediaType))
  );

  const uniqueRoles = new Map<string, MediaRole>();

  roles.forEach((role) => {
    if (role) {
      const key = `${role.personId}-${role.mediaId}`;
      uniqueRoles.set(key, role);
    }
  });
  return Array.from(uniqueRoles.values());
};

const buildPersonAndRole = async (
  mediaData: RoleData,
  mediaId: number,
  mediaType: MediaType
): Promise<MediaRole | null> => {
  if (!mediaData) {
    return null;
  }
  const personData: CreatePerson = {
    name: mediaData.name,
    tmdbId: mediaData.tmdbId,
    image: mediaData.image,
    country: mediaData.country ? [mediaData.country] : [Country.UNKNOWN],
  };
  const person: Person | null = await getOrCreatePerson(personData);
  if (!person) {
    return null;
  }
  const roleData: CreateMediaRole = {
    personId: person.id,
    mediaId,
    mediaType,
    role: mediaData.type,
  };
  if (roleData.role === AuthorType.Actor) {
    roleData.characterName = [mediaData.character];
    roleData.order = mediaData.order;
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
    return mediaRole;
  }
  return null;
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
