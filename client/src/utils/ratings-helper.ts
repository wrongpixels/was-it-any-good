import { UserVote } from '../../../shared/types/common';

export const numToVote = (num: number): UserVote => {
  return Math.max(-1, Math.min(num, 10)) as UserVote;
};
