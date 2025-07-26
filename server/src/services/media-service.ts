//Shared services for building TMDB Media

import { Transaction } from 'sequelize';
import { Film, MediaGenre, MediaRole, Show } from '../models';
import Genre from '../models/genres/genre';
import { CreateMediaRole } from '../models/people/mediaRole';
import Person, { CreatePerson } from '../models/people/person';
//import { CreateGenreData } from '../types/genres/genre-types';
import { AuthorType, MediaData, MediaPerson } from '../types/media/media-types';
import {
  acceptedJobs,
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
  //we bulk create with an empty updateOnDuplicate array to return existing entries too.
  const genres: Genre[] = await Genre.bulkCreate(mediaData.genres, {
    updateOnDuplicate: ['name'],
    transaction,
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
  //we need each person only once, so we create a map and avoid repetitions.
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
  //the bulk with updateOnDuplicate will return both the added and updated entries
  //of all valid people involved in the media
  const peopleEntries: Person[] = await Person.bulkCreate(peopleToCreate, {
    transaction,
    updateOnDuplicate: ['image'],
  });

  //we trim sequelize logic and return it to create the roles/jobs for each person
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
  //we create a map to match the tmdbIds and ids of the elements in 'people' array.
  //this allows us to get 'id' form 'tmdbId' without using 'find'
  const tmdbIdToIdMap = new Map(
    people.filter((p) => !!p.tmdbId && !!p.id).map((p) => [p.tmdbId, p.id])
  );

  //we take the original mediaPeople array to create MediaRoles/jobs for each person there.
  const mediaRolesMap = new Map<string, CreateMediaRole>();
  mediaPeople.forEach((mediaPerson: MediaPerson) => {
    if (!mediaPerson.tmdbId || !mediaPerson.type) {
      return;
    }
    //we ensure we only create MediaRoles for people with a tmdbId matching a valid id.
    const dbId = tmdbIdToIdMap.get(mediaPerson.tmdbId);
    if (!dbId) {
      return;
    }
    //a person can have multiple jobs in a movie/show, but not 2 of the same type, so if a
    //role is present twice, we simply keep the last.
    const key = `${dbId}_${mediaId}_${mediaType}_${mediaPerson.type}`;
    const createRole: CreateMediaRole = {
      personId: dbId,
      mediaId,
      mediaType,
      role: mediaPerson.type,
    };
    //we consider Actor to be a single job with different character names.
    //if a second Actor job is being created, we add the character to the existing ones
    if (
      mediaPerson.type === AuthorType.Actor &&
      'character' in mediaPerson &&
      mediaPerson.character
    ) {
      const actorRole: CreateMediaRole | undefined = mediaRolesMap.get(key);
      const newCharacterName: string[] =
        mediaPerson.character && mediaPerson.character.length > 0
          ? mediaPerson.character
          : ['UNKNOWN'];
      createRole.characterName = actorRole?.characterName
        ? actorRole.characterName.concat(newCharacterName)
        : newCharacterName;
      createRole.order = actorRole?.order
        ? Math.min(mediaPerson.order, actorRole.order)
        : mediaPerson.order;
    }
    mediaRolesMap.set(key, createRole);
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
export const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => {
  return {
    ...credits,
    cast: credits.cast.slice(0, 20),
    crew: credits.crew.filter((crewMember: TMDBCrewData) =>
      acceptedJobs.includes(crewMember.job)
    ),
  };
};
