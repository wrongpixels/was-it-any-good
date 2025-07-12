//Shared services for building TMDB Media

import { Op, Transaction } from 'sequelize';
import { Film, MediaGenre, MediaRole, Show } from '../models';
import Genre from '../models/genres/genre';
import { CreateMediaRole } from '../models/people/mediaRole';
import Person, { CreatePerson } from '../models/people/person';
//import { CreateGenreData } from '../types/genres/genre-types';
import { AuthorType, MediaData, MediaPerson } from '../types/media/media-types';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCrewData,
} from '../schemas/tmdb-media-schema';
import CustomError from '../util/customError';
import { MediaType } from '../../../shared/types/media';
import { CreateMediaGenre } from '../../../shared/types/models';

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
  await Genre.bulkCreate(mediaData.genres, {
    ignoreDuplicates: true,
    transaction,
  });
  const tmdbIds: number[] = mediaData.genres
    .map((genre) => genre.tmdbId)
    .filter((id): id is number => id !== undefined);
  const genres: Genre[] = await Genre.findAll({
    transaction,
    where: {
      tmdbId: {
        [Op.in]: tmdbIds,
      },
    },
  });

  const createMediaGenres: CreateMediaGenre[] = genres.map((g: Genre) => ({
    mediaId,
    mediaType,
    genreId: g.id,
  }));
  console.log(createMediaGenres);
  const mediaGenres: MediaGenre[] = await MediaGenre.bulkCreate(
    createMediaGenres,
    { ignoreDuplicates: true, transaction }
  );
  return mediaGenres?.length > 0 ? mediaGenres : null;
};

const mediaPersonToCreatePerson = (mediaPerson: MediaPerson): CreatePerson => ({
  name: mediaPerson.name,
  tmdbId: mediaPerson.tmdbId,
  image: mediaPerson.image,
  country: mediaPerson.country ? [mediaPerson.country] : ['UNKNOWN'],
});

const bulkCreatePeople = async (
  mediaPeople: MediaPerson[],
  transaction: Transaction
): Promise<Person[] | null> => {
  const peopleMap = new Map<number, CreatePerson>();
  mediaPeople.forEach((mp: MediaPerson) => {
    if (mp?.tmdbId) {
      peopleMap.set(mp.tmdbId, mediaPersonToCreatePerson(mp));
    }
  });
  const peopleToCreate: CreatePerson[] = Array.from(peopleMap.values());
  if (peopleToCreate.length === 0) {
    return null;
  }
  await Person.bulkCreate(peopleToCreate, {
    transaction,
    updateOnDuplicate: ['image'],
  });
  const tmdbIdList: number[] = Array.from(peopleMap.keys());
  const peopleEntries: Person[] = await Person.findAll({
    transaction,
    where: {
      tmdbId: {
        [Op.in]: tmdbIdList,
      },
    },
    attributes: ['tmdbId', 'id'],
  });

  if (peopleEntries.length > 0) {
    return peopleEntries;
  }
  return null;
};
export const bulkCreateMediaRoles = async (
  mediaPeople: MediaPerson[],
  people: Person[],
  mediaId: number,
  mediaType: MediaType,
  transaction: Transaction
): Promise<MediaRole[] | null> => {
  const tmdbIdToIdMap = new Map<number, number>();
  people.forEach((p) => {
    if (p.tmdbId && p.id) {
      tmdbIdToIdMap.set(p.tmdbId, p.id);
    }
  });
  const mediaRolesMap = new Map<string, CreateMediaRole>();
  mediaPeople.forEach((mediaPerson: MediaPerson) => {
    if (!mediaPerson.tmdbId || !mediaPerson.type) {
      return;
    }
    const personDbId = tmdbIdToIdMap.get(mediaPerson.tmdbId);
    if (!personDbId) {
      return;
    }
    const key = `${personDbId}_${mediaId}_${mediaType}_${mediaPerson.type}`;
    const createRole: CreateMediaRole = {
      personId: personDbId,
      mediaId,
      mediaType,
      role: mediaPerson.type,
    };
    mediaRolesMap.set(key, createRole);

    if (
      mediaPerson.type === AuthorType.Actor &&
      'character' in mediaPerson &&
      mediaPerson.character
    ) {
      createRole.characterName =
        mediaPerson.character && mediaPerson.character.length > 0
          ? mediaPerson.character
          : ['UNKNOWN'];
      createRole.order = mediaPerson.order;
    }
  });
  const rolesToCreateInDb = Array.from(mediaRolesMap.values());
  if (rolesToCreateInDb.length === 0) {
    return null;
  }
  const mediaRoleEntries: MediaRole[] = await MediaRole.bulkCreate(
    rolesToCreateInDb,
    {
      ignoreDuplicates: true,
      transaction,
    }
  );
  return mediaRoleEntries.length > 0 ? mediaRoleEntries : null;
};

export const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 20),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});
