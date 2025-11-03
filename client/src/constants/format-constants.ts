export const CLEAN_WIKIPEDIA_DESCRIPTION: string =
  'Description above from the Wikipedia';

export const CLEAN_WIKIPEDIA_PARTIAL_DESCRIPTION: string =
  'From Wikipedia, the free encyclopedia';

export const CLEAN_BRACKETS_PATTERN: RegExp = /(\s*\[.*?\]\s*)/g;
//a regex expression that excludes mentions of age (He/she/John Smith is a X years old Y... He/she/John is X years old... etc)
export const CLEAN_AGE_MENTION_PATTERN: RegExp =
  /\b(?:he|she)(?:\s+is|['’]s)\s+(?:a\s+)?[\w-]{1,20}(?:\s+\w{1,20})?\s*years?\s*old\b/i;
