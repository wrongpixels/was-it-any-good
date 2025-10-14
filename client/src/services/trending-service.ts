import { IndexMediaResults } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getTrending = async (page: number) =>
  await getFromAPI<IndexMediaResults>(apiPaths.trending.byPage(page));
