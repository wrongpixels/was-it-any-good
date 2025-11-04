import { PersonGender } from '../types/people';
import { AuthorType } from '../types/roles';

export const numToPersonGender = (num: number): PersonGender => {
  switch (num) {
    case 0:
      return PersonGender.Unknown;
    case 1:
      return PersonGender.Female;
    case 2:
      return PersonGender.Male;
    case 3:
      return PersonGender.NonBinary;
    default:
      return PersonGender.Unknown;
  }
};

export const getPronoun = (gender: PersonGender): string => {
  switch (gender) {
    case PersonGender.Male:
      return 'he';
    case PersonGender.Female:
      return 'she';
    default:
      return 'they';
  }
};

export const getBeVerb = (gender: PersonGender): string => {
  switch (gender) {
    case PersonGender.Male:
    case PersonGender.Female:
      return 'is';
    default:
      return 'are';
  }
};

export const getBeVerbPast = (gender: PersonGender): string => {
  switch (gender) {
    case PersonGender.Male:
    case PersonGender.Female:
      return 'was';
    default:
      return 'were';
  }
};

export const getPossessiveAdjective = (gender: PersonGender): string => {
  switch (gender) {
    case PersonGender.Male:
      return 'his';
    case PersonGender.Female:
      return 'her';
    default:
      return 'their';
  }
};

export const getPossessivePronoun = (gender: PersonGender): string => {
  switch (gender) {
    case PersonGender.Male:
      return 'his';
    case PersonGender.Female:
      return 'hers';
    default:
      return 'theirs';
  }
};

export const getGenderedAuthor = (
  gender: PersonGender,
  role: AuthorType
): string => {
  if (gender === PersonGender.Female) {
    switch (role) {
      case AuthorType.Actor:
        return 'Actress';
      case AuthorType.VoiceActor:
        return 'Voice Actress';
      default:
        return role;
    }
  }
  return role;
};
