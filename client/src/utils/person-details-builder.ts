import {
  formatDate,
  getAge,
  tryAddParenthesis,
} from '../../../shared/helpers/format-helper';
import {
  getMediaFromRole,
  getMediaRolePopularity,
} from '../../../shared/helpers/media-helper';
import { getGenderedAuthors } from '../../../shared/helpers/people-helper';
import { CountryCode } from '../../../shared/types/countries';
import {
  MediaResponse,
  MediaRoleResponse,
  PersonResponse,
} from '../../../shared/types/models';
import { PersonGender } from '../../../shared/types/people';
import {
  AuthorMedia,
  AuthorType,
  MergedPersonMediaRole,
} from '../../../shared/types/roles';
import { joinWithAnd } from './common-format-helper';
import { buildDescription } from './person-details-helper';

const MAX_ROLES_DESCRIPTION: number = 3;
const MAX_MEDIA_PER_ROLE_DESCRIPTION: number = 3;

//a function that provides PersonDetails formatted in the different
//ways our PersonPage and its sub-components will need

export interface PersonDetailsValues {
  personName: string;
  displayBirthPlace: string | undefined;
  shortDisplayBirthPlace: string | undefined;
  displayParts: string[] | undefined;
  personPassedAway: boolean;
  formattedBornDate: string;
  formattedDeathDate: string;
  deathAge: number | null;
  currentAge: number | null;
  displayDeathDate: string;
  displayBornDate: string;
  mainRoles: string | undefined;
  mainRolesWithAnd: string;
  countryCodes: CountryCode[] | undefined;
  description: string;
}

export const buildPersonDetails = (
  person: PersonResponse
): PersonDetailsValues => {
  //BIRTHPLACE
  //if we have more than 3 parts in the location (city, region, state, country)
  //we just keep the 1st (city) + last 2 (state, country)
  const parts: string[] | undefined = person.birthPlace?.split(', ');

  //the 'long' version of birthPlace (City, State, Country), as a string
  const displayBirthPlace: string | undefined = !parts
    ? undefined
    : parts.length <= 3
      ? person.birthPlace
      : `${parts[0]}, ${parts.slice(-2).join(', ')}`;

  //the split parts of birthPlace, so we know is max 3, where 1st is City and last is Country
  //we'll use them in the PersonDetails component
  const displayParts: string[] | undefined = displayBirthPlace?.split(', ');

  //the 'short' version of birthPlace (City, Country), as a string
  //we'll use them if we need to write our own description
  const shortDisplayBirthPlace: string | undefined = !displayParts
    ? undefined
    : displayParts?.length <= 2
      ? displayBirthPlace
      : [displayParts[0], displayParts[displayParts.length - 1]].join(', ');

  //BORN, AGE AND DEATH
  const born: string = person.birthDate ?? '';
  const death: string = person.deathDate ?? '';
  const personPassedAway: boolean = death ? true : false;
  const formattedBornDate: string = born ? formatDate(born) : '';
  const currentAge: number | null = death ? null : getAge(born);
  const formattedDeathDate: string = formatDate(death);
  const deathAge: number | null = getAge(born, death);
  const displayDeathAge: string = !deathAge
    ? ''
    : tryAddParenthesis(`aged ${deathAge}`);
  const displayDeathDate: string = !personPassedAway
    ? ''
    : !displayDeathAge
      ? formattedDeathDate
      : `${formattedDeathDate} ${displayDeathAge}`;
  const displayCurrentAge: string = !currentAge
    ? ''
    : tryAddParenthesis(`age ${currentAge}`);
  const displayBornDate: string = !displayCurrentAge
    ? formattedBornDate
    : `${formattedBornDate} ${displayCurrentAge}`;

  //PERSON ROLES
  //We list the main roles of the Person with and without 'and'
  const genderedRoles: string[] | AuthorType[] = person.sortedRoles?.mainRoles
    ? person.gender !== PersonGender.Female
      ? person.sortedRoles.mainRoles
      : getGenderedAuthors(person.gender, person.sortedRoles.mainRoles)
    : [];

  const mainRoles: string = genderedRoles.join(', ') ?? '';
  const mainRolesWithAnd: string = joinWithAnd(
    genderedRoles.map((s: string) => s.toLowerCase()) ?? []
  );

  const mainCreatorRoles = getMainRolesByAuthorType(
    person.sortedRoles?.mediaByRole,
    AuthorType.Creator
  );
  const mainDirectorRoles = getMainRolesByAuthorType(
    person.sortedRoles?.mediaByRole,
    AuthorType.Director
  );
  const mainWriterRoles = getMainRolesByAuthorType(
    person.sortedRoles?.mediaByRole,
    AuthorType.Writer
  );
  const mainActorRoles = getMainRolesByAuthorTypes(
    person.sortedRoles?.mediaByRole,
    [AuthorType.Actor, AuthorType.VoiceActor]
  );
  //we combine them all
  const allMainRoles: MediaRoleResponse[] = [
    ...mainDirectorRoles,
    ...mainCreatorRoles,
    ...mainWriterRoles,
    ...mainActorRoles,
  ];

  //and we merge all the roles per media entry
  const mergedRoles = new Map<number, MergedPersonMediaRole>();
  allMainRoles.forEach((mr: MediaRoleResponse) => {
    const media: MediaResponse | undefined = getMediaFromRole(mr);
    if (media) {
      const isActorRole: boolean = [
        AuthorType.Actor,
        AuthorType.VoiceActor,
      ].includes(mr.role);
      const entry = mergedRoles.get(media.indexId);
      if (entry) {
        //if the person has director-writer-creator roles, they override the acting roles.
        //
        const hasCreationRoles: boolean = !!!entry.authorType?.find(
          (a: AuthorType) =>
            [AuthorType.Actor, AuthorType.VoiceActor].includes(a)
        );
        if (isActorRole && hasCreationRoles) {
          return;
        }
        if (!isActorRole && !hasCreationRoles) {
          entry.characterName = [];
          entry.authorType = [mr.role];
          return;
        }

        entry.characterName = [...entry.characterName, ...mr.characterName];
        entry.authorType = [...entry.authorType, mr.role];
      } else {
        mergedRoles.set(media.indexId, {
          media,
          authorType: [mr.role],
          characterName: mr.characterName,
        });
      }
    }
  });

  //and finally, we extract the merged roles, sort them by number of author types and slice to MAX_ROLES_DESCRIPTION
  const orderedMergedRoles: MergedPersonMediaRole[] = Array.from(
    mergedRoles.values()
  )
    .sort((a, b) => b.authorType.length - a.authorType.length)
    .slice(0, MAX_ROLES_DESCRIPTION);

  //DESCRIPTION
  //if the person has a default description, we format it, trim it a bit,
  //and use it as it is. If not, we build one with the data we just created.

  const personDetailsValues: PersonDetailsValues = {
    personName: person.name,
    displayBirthPlace,
    shortDisplayBirthPlace,
    displayParts,
    personPassedAway,
    formattedBornDate,
    formattedDeathDate,
    deathAge,
    currentAge,
    displayDeathDate,
    displayBornDate,
    mainRoles,
    mainRolesWithAnd,
    countryCodes: person.country,
    description: person.description || '',
  };

  const finalDescription: string = buildDescription(
    personDetailsValues,
    orderedMergedRoles,
    person.gender
  );

  return { ...personDetailsValues, description: finalDescription };
};

const getMainRolesByAuthorType = (
  authorMedia: AuthorMedia[] | undefined,
  authorType: AuthorType
): MediaRoleResponse[] => {
  return !authorMedia
    ? []
    : getMainRoles(
        authorMedia.find((am: AuthorMedia) => am.authorType === authorType)
      );
};

//to group different AuthorType in the same category
const getMainRolesByAuthorTypes = (
  authorMedia: AuthorMedia[] | undefined,
  authorTypes: AuthorType[],
  limit: number = MAX_MEDIA_PER_ROLE_DESCRIPTION
) => {
  if (!authorMedia) {
    return [];
  }
  const filteredByAuthorTypes: AuthorMedia[] = authorMedia.filter(
    (am: AuthorMedia) => authorTypes.includes(am.authorType)
  );
  //we combine the roles of all the authorTypes requested, order by popularity, and slice by limit
  return (
    filteredByAuthorTypes
      .flatMap((am: AuthorMedia) => getMainRoles(am))
      //we combine the roles of all the authorTypes requested, order by popularity, and slice by limit
      .sort(
        (a: MediaRoleResponse, b: MediaRoleResponse) =>
          getMediaRolePopularity(b) - getMediaRolePopularity(a)
      )
      .slice(0, limit)
  );
};

const getMainRoles = (
  am: AuthorMedia | undefined,
  limit: number = MAX_MEDIA_PER_ROLE_DESCRIPTION
): MediaRoleResponse[] => {
  return !am ? [] : am.mediaRoles.slice(0, limit);
};
