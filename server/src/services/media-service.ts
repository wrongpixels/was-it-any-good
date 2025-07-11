//Shared services for building TMDB Media

import { Op, Transaction } from 'sequelize';
import { Film, MediaGenre, MediaRole, Show } from '../models';
import Genre from '../models/genres/genre';
import { CreateMediaRole } from '../models/people/mediaRole';
import Person, { CreatePerson } from '../models/people/person';
import { CreateGenreData } from '../types/genres/genre-types';
import { AuthorType, MediaData, MediaPerson } from '../types/media/media-types';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCrewData,
} from '../schemas/tmdb-media-schema';
import CustomError from '../util/customError';
import { MediaType } from '../../../shared/types/media';

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
    //throw new CustomError('Error creating genres', 400);
  }

  const credits: MediaRole[] | null = await buildCredits(
    mediaData,
    mediaId,
    transaction
  );
  if (!credits) {
    //throw new CustomError('Error creating credits', 400);
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
        .scope(['withSeasons', 'withCredits'])
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
  const cast: MediaRole[] | null = await buildPeople(
    mediaData.cast,
    mediaId,
    mediaData.mediaType,
    transaction
  );
  const crew: MediaRole[] | null = await buildPeople(
    mediaData.crew,
    mediaId,
    mediaData.mediaType,
    transaction
  );
  const combinedCredits = [...(cast || []), ...(crew || [])];
  return combinedCredits.length > 0 ? combinedCredits : null;
};

const buildPeople = async (
  mediaPeople: MediaPerson[],
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const people: Person[] | null = await bulkCreatePeople(
    mediaPeople,
    transaction
  );
  if (!people) {
    return null;
  }
  const mediaRoles: MediaRole[] | null = await bulkCreateMediaRoles(
    mediaPeople,
    people,
    mediaId,
    mediaType,
    transaction
  );
  return mediaRoles;
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
  console.log('getOrBuildGenre input:', genreData);

  const [genre]: [Genre, boolean] = await Genre.findOrCreate({
    where: {
      tmdbId: genreData.mediaId,
      name: genreData.name,
    },
    transaction,
  });
  const mediaGenre: [MediaGenre, boolean] = await MediaGenre.findOrCreate({
    where: {
      genreId: genre.id,
      mediaId,
      mediaType,
    },
    defaults: {
      genreId: genre.id,
      mediaId,
      mediaType,
    },
    transaction,
  });
  return mediaGenre[0];
};

const bulkCreatePeople = async (
  mediaPeople: MediaPerson[],
  transaction: Transaction
): Promise<Person[] | null> => {
  const peopleList: CreatePerson[] = new Array<CreatePerson>();
  const tmdbList: number[] = new Array<number>();
  mediaPeople.map((role: MediaPerson) => {
    const person: CreatePerson | null = buildPerson(peopleList, role);
    if (person && person.tmdbId && !tmdbList.includes(person.tmdbId)) {
      peopleList.push(person);
      tmdbList.push(person.tmdbId);
    }
  });
  if (peopleList.length === 0) {
    return null;
  }
  await Person.bulkCreate(peopleList, { transaction, ignoreDuplicates: true });
  const peopleEntries: Person[] = await Person.findAll({
    transaction,
    where: {
      tmdbId: {
        [Op.in]: tmdbList,
      },
    },
  });
  if (peopleEntries.length > 0) {
    return peopleEntries;
  }
  return null;
};

const buildPerson = (
  peopleList: CreatePerson[],
  mediaPersonData: MediaPerson
): CreatePerson | null => {
  if (!mediaPersonData) {
    return null;
  }
  const personData: CreatePerson | null = findOrCreatePerson(
    mediaPersonData,
    peopleList
  );
  return personData;
};

const findOrCreatePerson = (
  mediaPerson: MediaPerson,
  personList: CreatePerson[]
): CreatePerson | null => {
  if (!mediaPerson.tmdbId) {
    return null;
  }
  let createPerson: CreatePerson | null =
    personList.find((p: CreatePerson) => p.tmdbId === mediaPerson.tmdbId) ||
    null;
  if (!createPerson) {
    createPerson = {
      name: mediaPerson.name,
      tmdbId: mediaPerson.tmdbId,
      image: mediaPerson.image,
      country: mediaPerson.country ? [mediaPerson.country] : ['UNKNOWN'],
    };
  }
  return createPerson;
};

const bulkCreateMediaRoles = async (
  mediaPeople: MediaPerson[],
  people: Person[],
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const rolesList: CreateMediaRole[] = new Array<CreateMediaRole>();
  mediaPeople.map((mediaPerson: MediaPerson) => {
    const mediaRole: CreateMediaRole | null = buildRole(
      rolesList,
      people,
      mediaId,
      mediaType,
      mediaPerson
    );
    if (mediaRole && mediaRole.personId) {
      rolesList.push(mediaRole);
    }
  });
  if (rolesList.length === 0) {
    return null;
  }
  const mediaRoleEntries: MediaRole[] = await MediaRole.bulkCreate(rolesList, {
    transaction,
  });
  if (mediaRoleEntries.length === 0) {
    return null;
  }
  return mediaRoleEntries;
};

const buildRole = (
  rolesList: CreateMediaRole[],
  people: Person[],
  mediaId: number,
  mediaType: MediaType,
  mediaPerson: MediaPerson
): CreateMediaRole | null => {
  const personId: number | null =
    people.find((p: Person) => p.tmdbId === mediaPerson.tmdbId)?.id || null;
  if (!personId) {
    return null;
  }
  const roleData: CreateMediaRole | null = findOrCreateMediaRole(
    rolesList,
    personId,
    mediaId,
    mediaType,
    mediaPerson
  );
  if (!roleData) {
    return null;
  }
  if (
    mediaPerson.type === AuthorType.Actor &&
    'character' in mediaPerson &&
    'order' in mediaPerson
  ) {
    if (!roleData.characterName || roleData.characterName.length === 0) {
      roleData.characterName = [mediaPerson.character];
    } else {
      roleData.characterName.push(mediaPerson.character);
    }
    roleData.order = mediaPerson.order;
  }
  return roleData;
};

const findOrCreateMediaRole = (
  rolesList: CreateMediaRole[],
  personId: number,
  mediaId: number,
  mediaType: MediaType,
  mediaPerson: MediaPerson
): CreateMediaRole | null => {
  let createMediaRole: CreateMediaRole | null =
    rolesList.find(
      (m: CreateMediaRole) =>
        m.personId === personId && m.role === mediaPerson.type
    ) || null;
  if (!createMediaRole) {
    createMediaRole = {
      personId,
      mediaId,
      mediaType,
      role: mediaPerson.type,
    };
  }
  return createMediaRole;
};

export const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 20),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});
