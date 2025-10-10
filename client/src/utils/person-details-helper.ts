import { TxtParentNodeWithSentenceNodeContent, split } from 'sentence-splitter';

import {
  CLEAN_WIKIPEDIA_DESCRIPTION,
  CLEAN_WIKIPEDIA_PARTIAL_DESCRIPTION,
} from '../constants/format-constants';
import { PersonDetailsValues } from './person-details-builder';
import {
  startsWithVowel,
  toFirstUpperCase,
} from '../../../shared/helpers/format-helper';

//a function that builds a simple 1 sentence description for people
//that have no TMDB biography

//a function that trims the TMDB Person biography into 2 sentences

//and removes any default Wikipedia mention
export const cleanDescription = (text: string): string => {
  const nodes: TxtParentNodeWithSentenceNodeContent[] = split(text);

  const sentences: string[] = nodes
    .filter(
      (node: TxtParentNodeWithSentenceNodeContent) => node.type === 'Sentence'
    )
    .map((node: TxtParentNodeWithSentenceNodeContent) => node.raw.trim());

  return sentences
    .filter((s: string) => !s.includes(CLEAN_WIKIPEDIA_DESCRIPTION))
    .slice(0, 2)
    .map((s: string) =>
      s.replace(/\u00A0/g, ' ').replace(CLEAN_WIKIPEDIA_PARTIAL_DESCRIPTION, '')
    )
    .join(' ')
    .trim();
};

//a function that builds a description using the data we have about
//the person or uses the default one if existing, with custom rules and
//formatting

export const buildDescription = (
  personDetailsValues: PersonDetailsValues
): string => {
  if (personDetailsValues.description) {
    return toFirstUpperCase(cleanDescription(personDetailsValues.description));
  }
  const verb: string = personDetailsValues.personPassedAway ? 'was' : 'is';
  const particle: string = startsWithVowel(personDetailsValues.mainRolesWithAnd)
    ? 'an'
    : 'a';
  const location: string = personDetailsValues.shortDisplayBirthPlace
    ? ` from ${personDetailsValues.shortDisplayBirthPlace}`
    : '';
  const deathDate: string =
    personDetailsValues.personPassedAway &&
    personDetailsValues.formattedDeathDate
      ? ` — ${personDetailsValues.formattedDeathDate}`
      : '';
  const bornDate: string = personDetailsValues.formattedBornDate
    ? ` (${personDetailsValues.formattedBornDate}${deathDate}), `
    : '';

  console.log(personDetailsValues);
  const finalDescription: string = `${personDetailsValues.personName}${bornDate} ${verb} ${particle} ${personDetailsValues.mainRolesWithAnd}${location}.`;
  return finalDescription;
};
