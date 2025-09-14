import { RatingResults } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getMyVotes = async (browseQuery: string): Promise<RatingResults> =>
  getFromAPI<RatingResults>(apiPaths.my.votes.byQuery(browseQuery));
