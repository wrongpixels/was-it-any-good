import { FindOptions, Includeable, WhereOptions } from 'sequelize';
import { buildIndexMediaInclude } from '../services/index-media-service';
import UserReview from '../models/users/userReview';
import { mergeIncludeables, mergeWhereOptions } from './model-helpers';

const baseInclude: Includeable = {
  association: 'indexMedia',
  attributes: ['mediaType'],
  include: buildIndexMediaInclude(),
};

export const buildReviewWhereOptions = (
  baseWhere: WhereOptions<UserReview>,
  options?: FindOptions<UserReview>
) => {
  return mergeWhereOptions<UserReview>(baseWhere, options?.where);
};

export const buildReviewIncludeableOptions = (
  options?: FindOptions<UserReview>
) => {
  return mergeIncludeables(baseInclude, options?.include);
};
