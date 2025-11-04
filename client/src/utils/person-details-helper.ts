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
import { AuthorType, MergedPersonMediaRole } from '../../../shared/types/roles';
import { MediaResponse } from '../../../shared/types/models';
import { joinWithAnd } from './common-format-helper';
import { getBeVerb, getPronoun } from '../../../shared/helpers/people-helper';
import { PersonGender } from '../../../shared/types/people';

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
  personDetailsValues: PersonDetailsValues,
  mergedMediaRoles: MergedPersonMediaRole[],
  gender: PersonGender
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

  const bornDateString: string = !personDetailsValues.formattedBornDate
    ? ''
    : !personDetailsValues.personPassedAway
      ? `born ${personDetailsValues.formattedBornDate}`
      : personDetailsValues.formattedBornDate;
  const bornDate: string = bornDateString
    ? ` (${bornDateString}${deathDate}), `
    : '';

  const rolesString: string = ` ${toFirstUpperCase(getPronoun(gender))} ${getBeVerb(gender)} best known for ${buildRolesString(mergedMediaRoles)}`;

  const finalDescription: string = `${personDetailsValues.personName}${bornDate} ${verb} ${particle} ${personDetailsValues.mainRolesWithAnd}${location}.${rolesString}.`;

  return finalDescription;
};

interface MergedRoleStringValues {
  //to know if this media had a single role and its authorType if so.
  monoRole: AuthorType | false;
  mergedRoleString: string;
}

const getConnector = (index: number, maxIndex: number): string => {
  const remaining: number = maxIndex - index;
  switch (remaining) {
    case 2:
      return maxIndex === 2 ? '' : ' as well as';
    case 1:
      return maxIndex > 1 ? ' and' : 'as well as';
    case 0:
      return maxIndex == 0
        ? ''
        : maxIndex === 1
          ? ' as well as'
          : ' as well as';
    default:
      return ' and';
  }
};

const buildRolesString = (mergedRoles: MergedPersonMediaRole[]) => {
  const maxIndex: number = mergedRoles.length - 1;
  let prevRoleWasMono: AuthorType | false;

  const rolesStrings: string[] = mergedRoles.map(
    (m: MergedPersonMediaRole, i: number) => {
      const { monoRole, mergedRoleString } = buildSingleRoleString(
        m,
        prevRoleWasMono
      );
      prevRoleWasMono = monoRole;
      return `${getConnector(i, maxIndex)} ${mergedRoleString}`;
    }
  );
  return rolesStrings.join();
};

const buildSingleRoleString = (
  mergedRole: MergedPersonMediaRole,
  prevRoleWasMono: AuthorType | false
): MergedRoleStringValues => {
  const monoRole: AuthorType | false =
    mergedRole.authorType.length === 1 ? mergedRole.authorType[0] : false;
  //if this and previous role were the same, we skip the 'directing', 'creating' etc verb.
  const skipAuthorVerb: boolean = monoRole && prevRoleWasMono === monoRole;
  const authorStrings: string[] = mergedRole.authorType.map((a: AuthorType) =>
    buildAuthorString(a, mergedRole.characterName, skipAuthorVerb)
  );
  return {
    monoRole,
    mergedRoleString: `${joinWithAnd(authorStrings)} ${buildMediaNameString(mergedRole.media)}`,
  };
};

const buildMediaNameString = (media: MediaResponse) => `${media.name}`;

const buildAuthorString = (
  author: AuthorType,
  characterName: string[],
  skipAuthorVerb: boolean
): string => {
  switch (author) {
    case AuthorType.Director:
      return skipAuthorVerb ? '' : 'directing';
    case AuthorType.Writer:
      return skipAuthorVerb ? '' : 'writing';
    case AuthorType.Creator:
      return skipAuthorVerb ? '' : 'creating';
    case AuthorType.VoiceActor:
    case AuthorType.Actor:
      return `${skipAuthorVerb ? '' : 'playing '}${formatCharacterNamesForDescription(characterName)} in`;
    default:
      return 'their work';
  }
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

//a special function to enum the main acting roles limited to 3.
const formatCharacterNamesForDescription = (characterNames: string[]) => {
  let splitNames: string[] = formatCharacterNames(characterNames).split(', ');
  //if we have too many roles for a single media, we get a max of 3.
  if (splitNames.length > 3) {
    splitNames = splitNames.splice(0, 3);
    //we also add a 'more' at the end
    splitNames.push('more');
  }
  return joinWithAnd(splitNames);
};
