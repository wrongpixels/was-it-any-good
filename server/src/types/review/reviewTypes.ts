import { Individual } from '../media/mediaTypes';

// User
export interface UserRatingData {
  id: number;
  userId: number;
  mediaId: number;
  score: number;
  createdAt: Date;
}

export interface UserReviewData {
  id: number;
  userId: number;
  ratingId: number;
  title: string;
  content: string;
  createdAt: Date;
}

// Professional
export interface ProReviewData {
  id: number;
  title: string;
  content: string;
  rating: ProRatingData;
  source: ProReviewSourceData;
}

export interface ProRatingData {
  type: string;
  verdict: ProReviewVerdict;
  score?: number;
  maxScore?: number;
}

export interface ProReviewSourceData {
  reviewerId: number;
  medium: string;
  url?: string;
}

export interface ProReviewerData extends Individual {
  reviewIds: number[];
}

export enum ProReviewVerdict {
  Negative = 'Negative',
  Neutral = 'Neutral',
  Positive = 'Positive',
}
