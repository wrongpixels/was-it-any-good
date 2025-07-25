import { IndexMediaData } from '../../../shared/types/models';
import { getFromAPI } from './common-service';

export const getSearch = async (searchQuery: string) =>
  await getFromAPI<IndexMediaData[]>(searchQuery);
