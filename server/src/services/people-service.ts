import { AxiosResponse } from 'axios';
import { stringToCountryCode } from '../../../shared/types/countries';
import {
  MediaRoleResponse,
  MediaResponse,
  PersonResponse,
} from '../../../shared/types/models';
import {
  SortedRoles,
  AuthorMedia,
  authorOrder,
  AuthorType,
} from '../../../shared/types/roles';
import { Person } from '../models';
import {
  TMDBPersonDetails,
  TMDBPersonDetailsSchema,
} from '../schemas/tmdb-person-details-schema';
import { tmdbAPI } from '../util/config';
import { tmdbPaths } from '../util/url-helper';
import { formatBirthPlace } from '../../../shared/helpers/format-helper';
import { getMediaFromRole } from '../../../shared/helpers/media-helper';

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
    const normalizedBirthPlace: string =
      //we normalize the Chinese commas
      personDetails.place_of_birth
        ?.replace(/，/g, ',')
        // and also the spaces around them
        ?.replace(/\s*,\s*/g, ', ') ?? '';

    //we extract the country from the place of birth (format 'City, Province, Country')
    const countryString: string = normalizedBirthPlace.split(', ').pop() ?? '';
    await person.update({
      addedDetails: true,
      gender: personDetails.gender,
      birthPlace: formatBirthPlace(normalizedBirthPlace),
      birthDate: personDetails.birthday || undefined,
      deathDate: personDetails.deathday || undefined,
      description: personDetails.biography || undefined,
      //we try to match the country extracted with a valid CountryCode to assign a country to
      //people, as TMDB doesn't do it even in these extended details
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

const addRoleToAuthorMedia = (
  authorMedia: AuthorMedia[],
  mediaRole: MediaRoleResponse
) => {
  //we look for an entry for this author type
  const entry = authorMedia.find(
    (a: AuthorMedia) => a.authorType === mediaRole.role
  );
  if (entry) {
    //if it already exists, we add this media to the list and the characterName
    entry.role.push(mediaRole);
  } else {
    //if not, we create the list and add it as the first role entry
    authorMedia.push({ authorType: mediaRole.role, role: [mediaRole] });
  }
};

//a custom logic that returns the media of a Person sorted by roles (Actor, Director, Producer...)
export const sortRoles = (person: PersonResponse): SortedRoles => {
  const authorMedia: AuthorMedia[] = [];
  //a copy of person without heavy data, to use in CreditResponse
  person.roles?.forEach((r: MediaRoleResponse) => {
    //we check the role has a valid media linked
    const media: MediaResponse | undefined = getMediaFromRole(r);
    if (media) {
      //we separate voice actor roles from regular actor ones.
      //this allows us to handle actors with regular roles and voice roles in the same media.
      if (r.role === AuthorType.Actor) {
        const voiceCharacters: string[] = [];
        const regularCharacters: string[] = [];

        for (const chara of r.characterName) {
          if (chara.includes('(voice)')) {
            voiceCharacters.push(chara);
          } else {
            regularCharacters.push(chara);
          }
        }
        //and we create/add either a Voice Actor, an Actor, or both
        if (voiceCharacters.length > 0) {
          addRoleToAuthorMedia(authorMedia, {
            ...r,
            characterName: voiceCharacters,
            role: AuthorType.VoiceActor,
          });
        }
        if (regularCharacters.length > 0) {
          addRoleToAuthorMedia(authorMedia, {
            ...r,
            characterName: regularCharacters,
          });
        }
      }
      //if not, we always add the role to AuthorMedia or create a new entry for it
      else {
        addRoleToAuthorMedia(authorMedia, r);
      }
    }
  });
  authorMedia.sort((a, b) => {
    const countB = b.role.length;
    const countA = a.role.length;
    if (countA !== countB) {
      return countB - countA;
    }
    return (
      authorOrder.indexOf(a.authorType) - authorOrder.indexOf(b.authorType)
    );
  });
  const mainRoles = authorMedia.map((role: AuthorMedia) => role.authorType);

  return { mediaByRole: authorMedia, mainRoles };
};

//we ony update if no details added yet or if a wrong formatted comma was added
//(because of early Chinese entries that TMDB doesn't format properly)
export const needsToFetchDetails = (person: PersonResponse): boolean => {
  return (
    person.addedDetails === false ||
    (person.addedDetails && person.birthPlace?.includes('，') === true)
  );
};
