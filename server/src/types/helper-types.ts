import { Transaction, WhereOptions } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

export interface RatingUpdateValues {
  rating: Literal;
  voteCount: Literal;
}
//we hardcode a returning true to make TS know we'll receive something back
export interface RatingUpdateOptions {
  where: WhereOptions;
  returning: true;
  transaction: Transaction | undefined;
}
