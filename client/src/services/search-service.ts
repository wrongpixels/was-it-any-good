import { IndexMediaData } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getSearch = async (searchQuery: string) => {
  const result = await getFromAPI<IndexMediaData[]>(
    apiPaths.search.byQuery(searchQuery)
  );
  console.log(result);
  return result;
};
