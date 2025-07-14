import axios, { AxiosResponse } from 'axios';
import { IndexMediaData } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';

export const getSuggestions = async (
  input: string
): Promise<IndexMediaData[]> => {
  const { data }: AxiosResponse<IndexMediaData[]> = await axios.get(
    apiPaths.suggestions.byInput(input)
  );
  return data;
};
