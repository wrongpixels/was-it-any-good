import { IndexMediaResults } from '../../../shared/types/models';
import { getFromAPI } from './common-service';

export const getBrowseResults = async (browseQuery: string, apiPath: string) =>
  await getFromAPI<IndexMediaResults>(`${apiPath}?${browseQuery}`);
