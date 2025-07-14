import { IndexMediaData } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getSuggestions = async (
  input: string
): Promise<IndexMediaData[]> =>
  getFromAPI<IndexMediaData[]>(apiPaths.suggestions.byInput(input));
