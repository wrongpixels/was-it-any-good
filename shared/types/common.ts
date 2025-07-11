export type offset = {
  x: number;
  y: number;
};

export const DEF_OFFSET: offset = {
  x: 0,
  y: 0,
};
export type Image = string;

export enum UserVote {
  None = 0,
  Unvote = -1,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
}
