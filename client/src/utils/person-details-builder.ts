import {
  formatDate,
  getAge,
  tryAddParenthesis,
} from '../../../shared/helpers/format-helper';
import { getGenderedAuthors } from '../../../shared/helpers/people-helper';
import { CountryCode } from '../../../shared/types/countries';
import { PersonResponse } from '../../../shared/types/models';
import { PersonGender } from '../../../shared/types/people';
import { AuthorType } from '../../../shared/types/roles';
import { joinWithAnd } from './common-format-helper';
import { buildDescription } from './person-details-helper';

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
  console.log(person.gender);
  const genderedRoles: string[] | AuthorType[] = person.sortedRoles?.mainRoles
    ? person.gender !== PersonGender.Female
      ? person.sortedRoles.mainRoles
      : getGenderedAuthors(person.gender, person.sortedRoles.mainRoles)
    : [];

  const mainRoles: string = genderedRoles.join(', ') ?? '';
  const mainRolesWithAnd: string = joinWithAnd(
    genderedRoles.map((s: string) => s.toLowerCase()) ?? []
  );

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

  const finalDescription: string = buildDescription(personDetailsValues);

  return { ...personDetailsValues, description: finalDescription };
};
