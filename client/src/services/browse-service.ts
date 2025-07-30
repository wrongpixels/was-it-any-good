import { IndexMediaResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getBrowseResults = async (browseQuery: string) =>
  await getFromAPI<IndexMediaResponse>(apiPaths.browse.byQuery(browseQuery));
