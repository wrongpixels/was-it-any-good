import { IndexMediaResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getSearch = async (searchQuery: string) => {
  const result = await getFromAPI<IndexMediaResponse>(
    apiPaths.search.byQuery(searchQuery)
  );
  return result;
};
