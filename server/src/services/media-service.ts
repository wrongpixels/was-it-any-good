//Shared services for building TMDB Media

import { Transaction } from 'sequelize';
import { Film, MediaGenre, MediaRole, Show } from '../models';
import Genre from '../models/genres/genre';
import { CreateMediaRole } from '../models/people/mediaRole';
import Person, { CreatePerson } from '../models/people/person';
import { CreateGenreData } from '../types/genres/genre-types';
import {
  AuthorData,
  AuthorType,
  MediaData,
  MediaPerson,
  MediaType,
  RoleData,
} from '../types/media/media-types';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCrewData,
} from '../schemas/tmdb-media-schema';
import CustomError from '../util/customError';

//Overrides to ensure type safety

export function buildCreditsAndGetEntry(
  media: Film,
  mediaData: MediaData,
  transaction: Transaction
): Promise<Film | null>;

export function buildCreditsAndGetEntry(
  media: Show,
  mediaData: MediaData,
  transaction: Transaction
): Promise<Show | null>;

export async function buildCreditsAndGetEntry(
  media: Film | Show,
  mediaData: MediaData,
  transaction: Transaction
): Promise<Film | Show | null> {
  console.log('\n\nSTARTING PROCESS\n\n');
  const mediaId: number = media.id;

  const genres: MediaGenre[] | null = await buildGenres(
    mediaData,
    mediaId,
    mediaData.mediaType,
    transaction
  );
  if (!genres) {
    throw new CustomError('Error creating genres', 400);
  }

  const credits: MediaRole[] | null = await buildCredits(
    mediaData,
    mediaId,
    transaction
  );
  if (!credits) {
    throw new CustomError('Error creating credits', 400);
  }
  const finalMediaEntry: Film | Show | null = await getFinalEntry(
    mediaData,
    mediaId,
    transaction
  );

  if (!finalMediaEntry) {
    throw new CustomError(
      `Error gathering just created ${mediaData.mediaType}`,
      400
    );
  }
  console.log('\n\nENDED PROCESS\n\n');

  return finalMediaEntry;
}
//We need to do this to avoid 'mode.scope' ambiguity
const getFinalEntry = async (
  mediaData: MediaData,
  mediaId: number,
  transaction: Transaction
): Promise<Film | Show | null> => {
  switch (mediaData.mediaType) {
    case MediaType.Film:
      return await Film.unscoped()
        .scope('withCredits')
        .findByPk(mediaId, { transaction });
    case MediaType.Show:
      return await Show.unscoped()
        .scope(['defaultScope', 'withCredits'])
        .findByPk(mediaId, { transaction });
    default:
      return null;
  }
};

export const buildCredits = async (
  mediaData: MediaData,
  mediaId: number,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const cast: MediaRole[] | null = await buildCast(
    mediaData.cast,
    mediaId,
    mediaData.mediaType,
    transaction
  );
  const crew: MediaRole[] | null = await buildCrew(
    mediaData.crew,
    mediaId,
    mediaData.mediaType,
    transaction
  );
  const combinedCredits = [...(cast || []), ...(crew || [])];
  return combinedCredits.length > 0 ? combinedCredits : null;
};

const buildCast = async (
  cast: RoleData[],
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const roles: (MediaRole | null)[] = await Promise.all(
    cast.map((roleData) =>
      buildPersonAndRole(roleData, mediaId, mediaType, transaction)
    )
  );
  const validRoles = roles.filter((role): role is MediaRole => role !== null);
  return validRoles.length > 0 ? validRoles : null;
};

const buildCrew = async (
  crew: AuthorData[],
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const roles: (MediaRole | null)[] = await Promise.all(
    crew.map((authorData) =>
      buildPersonAndRole(authorData, mediaId, mediaType, transaction)
    )
  );
  const validRoles = roles.filter((role): role is MediaRole => role !== null);
  return validRoles.length > 0 ? validRoles : null;
};

export const buildGenres = async (
  mediaData: MediaData,
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaGenre[] | null> => {
  const genres: MediaGenre[] = await Promise.all(
    mediaData.genres.map((g: CreateGenreData) =>
      getOrBuildGenre(g, mediaId, mediaType, transaction)
    )
  );

  return genres?.length > 0 ? genres : null;
};

const getOrBuildGenre = async (
  genreData: CreateGenreData,
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaGenre> => {
  const genre: [Genre, boolean] = await Genre.findOrCreate({
    where: {
      tmdbId: genreData.mediaId,
      name: genreData.name,
    },
    transaction,
  });
  const mediaGenre: [MediaGenre, boolean] = await MediaGenre.findOrCreate({
    where: {
      genreId: genre[0].id,
      mediaId: mediaId,
    },
    defaults: {
      genreId: genre[0].id,
      mediaId: mediaId,
      mediaType: mediaType,
    },
    transaction,
  });
  return mediaGenre[0];
};

const buildPersonAndRole = async (
  mediaPersonData: MediaPerson,
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole | null> => {
  if (!mediaPersonData) {
    return null;
  }
  const personData: CreatePerson = {
    name: mediaPersonData.name,
    tmdbId: mediaPersonData.tmdbId,
    image: mediaPersonData.image,
    country: mediaPersonData.country ? [mediaPersonData.country] : ['UNKNOWN'],
  };
  const person: Person | null = await getOrCreatePerson(
    personData,
    transaction
  );
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
  return await buildMediaRole(roleData, transaction);
};

const buildMediaRole = async (
  roleData: CreateMediaRole,
  transaction: Transaction
): Promise<MediaRole | null> => {
  const mediaRole: MediaRole | null = await getOrCreateMediaRole(
    roleData,
    transaction
  );
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
          `Added person ${roleData.characterName[0]} with Media Role ${mediaRole.role}`
        );
      }
    }
    if (changed) {
      await mediaRole.save({ transaction });
    }
  }
  return mediaRole;
};

export const getOrCreatePerson = async (
  defaults: CreatePerson,
  _transaction: Transaction
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
  defaults: CreateMediaRole,
  _transaction: Transaction
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

export const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});
