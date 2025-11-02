import { IndexMediaData } from '../../../shared/types/models';
import { apiPaths } from '../../../shared/util/url-builder';
import { getFromAPI } from './common-service';

export const getSuggestions = async (
  input: string
): Promise<IndexMediaData[]> =>
  getFromAPI<IndexMediaData[]>(apiPaths.suggestions.byInput(input));
