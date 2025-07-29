import { BrowseResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getBrowseResults = async (browseQuery: string) =>
  await getFromAPI<BrowseResponse>(apiPaths.browse.byQuery(browseQuery));
