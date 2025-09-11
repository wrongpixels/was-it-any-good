import { IndexMediaResults } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getSearch = async (searchQuery: string) =>
  await getFromAPI<IndexMediaResults>(apiPaths.search.byQuery(searchQuery));
