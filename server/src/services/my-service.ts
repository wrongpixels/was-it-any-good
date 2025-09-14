import { Order } from 'sequelize';
import { SortBy, SortDir } from '../../../shared/types/browse';

//to get the proper order structure
export const getMyVotesOrder = (sortBy: SortBy, sortDir: SortDir): Order => {
  switch (sortBy) {
    case SortBy.UserScore:
    case SortBy.VoteDate:
      return [[sortBy, sortDir.toUpperCase()]];
    default:
      return [['indexMedia', sortBy, sortDir.toUpperCase()]];
  }
};
