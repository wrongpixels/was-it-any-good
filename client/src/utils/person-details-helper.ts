import { TxtParentNodeWithSentenceNodeContent, split } from 'sentence-splitter';

import {
  CLEAN_AGE_MENTION_PATTERN,
  CLEAN_BRACKETS_PATTERN,
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
//and removes any default Wikipedia or age mention (ages would get outdated fast!)
export const cleanDescription = (text: string): string => {
  const nodes: TxtParentNodeWithSentenceNodeContent[] = split(text);

  const sentences: string[] = nodes
    .filter(
      (node: TxtParentNodeWithSentenceNodeContent) => node.type === 'Sentence'
    )
    .map((node: TxtParentNodeWithSentenceNodeContent) => node.raw.trim());

  const cleanSentences: string[] = sentences
    .filter(
      (s: string) =>
        //we skip sentences with references to Wikipedia or the age of the person
        !s.includes(CLEAN_WIKIPEDIA_DESCRIPTION) &&
        !CLEAN_AGE_MENTION_PATTERN.test(s)
    )
    .slice(0, 2)
    .map((s: string) =>
      s
        .replace(/\u00A0/g, ' ')
        .replace(CLEAN_WIKIPEDIA_PARTIAL_DESCRIPTION, '')
        .replace(CLEAN_BRACKETS_PATTERN, ' ')
    );

  if (cleanSentences.length > 1) {
    //if first sentence is very long or the 2 combined, we only keep the first
    if (
      cleanSentences[0].length > 400 ||
      cleanSentences[0].length + cleanSentences[1].length > 500
    ) {
      cleanSentences.pop();
    }
  }

  return cleanSentences.join(' ').trim();
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

//a function to clean the characterNames array into a formatted single string
export const formatCharacterNames = (
  characterName: string[] | undefined
): string => {
  if (!characterName || characterName.length === 0) {
    return 'Unknown';
  }
  //this is important as TMDB uses absolutely inconsistent separation for characters, apart from random repetitions.
  //Long story short, different characters can appear as either different strings in the array, or as a single string
  //of the array separated by either '/' or ',' with, of course, inconsistent spacing.
  //eg: ['Sharon Marsh / Ms. Cartman', 'Sharon Marsh', 'News Reporter/Additional Voices'].
  //yes, that's a real example.
  //Thus, our best way to clean the noise as best as we can:
  const splitCharacterNames: string[] = [];
  characterName.forEach((c: string) =>
    c.split('/').forEach((s: string) => s && splitCharacterNames.push(s.trim()))
  );

  const uniqueCleanedNames = new Set<string>();

  splitCharacterNames.forEach((c: string) => {
    const cleaned = c
      .replace(/\s*\(voice\)/g, '')
      .replace(/ \/ /g, ', ')
      .trim();
    if (cleaned) {
      //we skip empty strings after cleaning and avoid adding the same twice.
      uniqueCleanedNames.add(cleaned);
    }
  });

  return Array.from(uniqueCleanedNames).join(', ') || 'Unknown';
};
