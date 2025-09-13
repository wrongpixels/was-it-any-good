import { IndexMediaResults } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getMyVotes = async (
  browseQuery: string
): Promise<IndexMediaResults> =>
  getFromAPI<IndexMediaResults>(apiPaths.my.votes.byQuery(browseQuery));
