import { IndexMediaResults } from '../../../shared/types/models';
import { apiPaths } from '../../../shared/util/url-builder';
import { getFromAPI } from './common-service';

export const getBrowseResults = async (browseQuery: string) =>
  await getFromAPI<IndexMediaResults>(apiPaths.browse.byQuery(browseQuery));
