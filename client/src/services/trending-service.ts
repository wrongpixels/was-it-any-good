import { IndexMediaResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getTrending = async () =>
  await getFromAPI<IndexMediaResponse>(apiPaths.trending);
