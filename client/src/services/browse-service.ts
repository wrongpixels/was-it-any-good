import { BrowseResponse } from '../../../shared/types/models';
import { getFromAPI } from './common-service';

export const getBrowseResults = async (query: string) =>
  await getFromAPI<BrowseResponse>(query);
