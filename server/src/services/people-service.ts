import { AxiosResponse } from 'axios';
import { stringToCountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import {
  MediaRoleResponse,
  MediaResponse,
  PersonResponse,
} from '../../../shared/types/models';
import {
  SortedRoles,
  AuthorMedia,
  authorOrder,
} from '../../../shared/types/roles';
import { Person } from '../models';
import {
  TMDBPersonDetails,
  TMDBPersonDetailsSchema,
} from '../schemas/tmdb-person-details-schema';
import { tmdbAPI } from '../util/config';
import { tmdbPaths } from '../util/url-helper';

//an extra call to TMDB API that populates extra options information for people.
//this is not done on creation for performance reason, and this info is only fetched
//when a user clicks on a person profile that doesn't have this info added yet
export const fetchAndUpdatePersonDetails = async (
  person: Person
): Promise<void> => {
  if (!person.tmdbId) {
    console.warn(`Person with id ${person.id} doesn't have a valid TMDB id`);
    return;
  }
  //we won't stop the person call if the extra info cannot be gathered, we simply will not
  //add it and return the basic info we have
  try {
    const tmdbPersonRes: AxiosResponse = await tmdbAPI.get(
      tmdbPaths.person.byTMDBId(person.tmdbId)
    );
    if (!tmdbPersonRes.data) {
      console.warn(
        `Person with TMDB id ${person.tmdbId} doesn't have valid extended details.`
      );
      return;
    }
    const personDetails: TMDBPersonDetails = TMDBPersonDetailsSchema.parse(
      tmdbPersonRes.data
    );
    //we extract the country from the place of birth
    const countryString: string =
      personDetails.place_of_birth?.split(', ').pop() ?? '';
    await person.update({
      addedDetails: true,
      birthPlace: personDetails.place_of_birth || undefined,
      birthDate: personDetails.birthday || undefined,
      deathDate: personDetails.deathday || undefined,
      description: personDetails.biography || undefined,
      country: [stringToCountryCode(countryString)],
    });
    console.log('Updated details for Person');
    return;
  } catch (error) {
    console.warn(
      `Error fetching data for Person with TMDB id ${person.tmdbId}. Error:`,
      error
    );
  }
  return;
};

const getMedia = (role: MediaRoleResponse): MediaResponse | undefined => {
  if (role.mediaType === MediaType.Film) {
    return role.film;
  }
  if (role.mediaType === MediaType.Show) {
    return role.show;
  }
  return undefined;
};
export const sortRoles = (person: PersonResponse): SortedRoles => {
  const authorMedia: AuthorMedia[] = [];
  person.roles?.forEach((r: MediaRoleResponse) => {
    const media: MediaResponse | undefined = getMedia(r);
    if (media) {
      const entry = authorMedia.find(
        (a: AuthorMedia) => a.authorType === r.role
      );
      if (entry) {
        entry.media.push(media);
      } else {
        authorMedia.push({ authorType: r.role, media: [media] });
      }
    }
  });
  authorMedia.sort((a, b) => {
    const countB = b.media.length;
    const countA = a.media.length;
    if (countA !== countB) {
      return countB - countA;
    }
    return (
      authorOrder.indexOf(a.authorType) - authorOrder.indexOf(b.authorType)
    );
  });
  const mainRoles = authorMedia.map((role) => role.authorType);
  return { mediaByRole: authorMedia, mainRoles };
};
