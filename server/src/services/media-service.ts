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
import { MediaType } from '../../../shared/types/media';
import { CreateMediaGenre, PersonResponse } from '../../../shared/types/models';
import { toPlainData } from '../util/model-helpers';

export const buildCreditsAndGenres = async (
  media: Film | Show,
  mediaData: MediaData,
  transaction?: Transaction
): Promise<MediaRole[] | null> => {
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

  const credits: MediaRole[] | null = await buildCastAndCrew(
    mediaData,
    mediaId,
    transaction
  );
  console.log('\n\nENDED PROCESS\n\n');
  return credits;
};

export const buildCastAndCrew = async (
  mediaData: MediaData,
  mediaId: number,
  transaction?: Transaction
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
  transaction?: Transaction
): Promise<MediaRole[] | null> => {
  const people: PersonResponse[] | null = await bulkCreatePeople(
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
  transaction?: Transaction
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
  transaction?: Transaction
): Promise<PersonResponse[] | null> => {
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
  const peopleEntries: Person[] = await Person.bulkCreate(peopleToCreate, {
    transaction,
    updateOnDuplicate: ['image'],
  });

  if (peopleEntries.length > 0) {
    return toPlainData<Person>(peopleEntries);
  }
  return null;
};
export const bulkCreateMediaRoles = async (
  mediaPeople: MediaPerson[],
  people: PersonResponse[],
  mediaId: number,
  mediaType: MediaType,
  transaction?: Transaction
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
const acceptedJobs: string[] = Object.values<string>(TMDBAcceptedJobs);

export const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => {
  return {
    ...credits,
    cast: credits.cast.slice(0, 20),
    crew: credits.crew.filter((crewMember: TMDBCrewData) =>
      acceptedJobs.includes(crewMember.job)
    ),
  };
};
