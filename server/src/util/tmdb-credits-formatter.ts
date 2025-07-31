import { CreatePerson } from '../models/people/person';
import {
  TMDBActorRole,
  TMDBCastRoleData,
  TMDBCreditsData,
  TMDBCrewData,
  TMDBCrewJob,
  TMDBShowCastRoleData,
  TMDBShowCreditsData,
  TMDBShowCrewData,
  acceptedJobs,
} from '../schemas/tmdb-media-schema';
import { MediaPerson } from '../types/media/media-types';
import CustomError from './customError';

export const mediaPersonToCreatePerson = (
  mediaPerson: MediaPerson
): CreatePerson => ({
  name: mediaPerson.name,
  tmdbId: mediaPerson.tmdbId,
  image: mediaPerson.image,
  country: mediaPerson.country ? [mediaPerson.country] : ['UNKNOWN'],
});

export const formatTMDBShowCredits = (
  showCredits: TMDBShowCreditsData
): TMDBCreditsData => ({
  ...showCredits,
  cast: formatTMDBCast(showCredits.cast),
  crew: formatTMDBCrew(showCredits.crew),
});

export const formatTMDBCast = (
  showCast: TMDBShowCastRoleData[]
): TMDBCastRoleData[] =>
  showCast.flatMap((actor: TMDBShowCastRoleData) =>
    actor.roles.map((role: TMDBActorRole) => ({
      ...actor,
      character: role.character,
      credit_id: role.credit_id,
    }))
  );

export const formatTMDBCrew = (showCrew: TMDBShowCrewData[]): TMDBCrewData[] =>
  showCrew.flatMap((person: TMDBShowCrewData) =>
    person.jobs.map((j: TMDBCrewJob) => ({
      ...person,
      credit_id: j.credit_id,
      job: j.job,
    }))
  );

export const trimCredits = (
  credits: TMDBCreditsData | undefined
): TMDBCreditsData => {
  if (!credits) {
    throw new CustomError('Error creating credits', 400);
  }
  return {
    ...credits,
    cast: credits.cast.slice(0, 20),
    crew: credits.crew
      .filter((crewMember: TMDBCrewData) =>
        acceptedJobs.includes(crewMember.job)
      )
      .slice(0, 20),
  };
};
