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
  gender: mediaPerson.gender,
  image: mediaPerson.image,
  country: mediaPerson.country ? [mediaPerson.country] : ['UNKNOWN'],
});

//we format show credits into regular ones, limiting their size in the process.
export const formatTMDBShowCredits = (
  showCredits: TMDBShowCreditsData
): TMDBCreditsData => ({
  ...showCredits,
  cast: formatTMDBCast(showCredits.cast),
  crew: formatTMDBCrew(showCredits.crew),
});

//whatever TMDB uses for ordering people is unreliable, as the "order" field is often
//ignored or outright inverted. As this data does come ordered, we override
//the "order" field to follow the flatMap's index.

export const formatTMDBCast = (
  showCast: TMDBShowCastRoleData[]
): TMDBCastRoleData[] =>
  showCast.slice(0, 25).flatMap((actor: TMDBShowCastRoleData, i: number) =>
    actor.roles.map((role: TMDBActorRole) => ({
      ...actor,
      order: i,
      character: role.character,
      credit_id: role.credit_id,
    }))
  );

//this can get big soon in multi-season shows!
//we just take the first 15 that are relevant to us
export const formatTMDBCrew = (
  showCrew: TMDBShowCrewData[]
): TMDBCrewData[] => {
  const crew = new Map<string, TMDBCrewData>();

  for (const person of showCrew) {
    if (crew.size >= 15) {
      break;
    }

    person.jobs.forEach((j: TMDBCrewJob) => {
      if (acceptedJobs.includes(j.job)) {
        const key: string = j.credit_id;
        crew.set(key, { ...person, credit_id: j.credit_id, job: j.job });
      }
    });
  }
  return Array.from(crew.values());
};

//for non-show credits, to limit the people we'll create.
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
