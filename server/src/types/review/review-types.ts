import { Individual } from '../media/media-types';

type VoteType = 'User' | 'Critic';

// User
export interface UserRatingData {
  id: number;
  userId: number;
  mediaId: number;
  score: number;
  createdAt: Date;
}

export interface UserVote {
  userId: number;
  reviewId: number;
  type: VoteType;
  value: -1 | 1;
}

export interface UserReviewData {
  id: number;
  userId: number;
  ratingId: number;
  title: string;
  content: string;
  votes: number;
  createdAt: Date;
}

// Critic
export interface CriticReviewData {
  id: number;
  title: string;
  content: string;
  rating: CriticRatingData;
  votes: number;
  source: CriticReviewSourceData;
}

export interface CriticRatingData {
  type: string;
  verdict: CriticReviewVerdict;
  score?: number;
  maxScore?: number;
}

export interface CriticReviewSourceData {
  reviewerId: number;
  medium: string;
  url?: string;
}

export interface CriticReviewerData extends Individual {
  reviewIds: number[];
}

export enum CriticReviewVerdict {
  Negative = 'Negative',
  Neutral = 'Neutral',
  Positive = 'Positive',
}
