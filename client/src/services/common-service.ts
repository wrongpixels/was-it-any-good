import axios, { AxiosResponse } from 'axios';
import { DEF_AXIOS_TIMEOUT } from '../../../shared/constants/timeout-constants';

export const getFromAPI = async <T>(url: string): Promise<T> => {
  console.log(url);
  const { data }: AxiosResponse<T> = await axios.get(url, DEF_AXIOS_TIMEOUT);
  return data;
};
