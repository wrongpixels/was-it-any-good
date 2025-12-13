import axios, { AxiosResponse } from 'axios';
import { DEF_AXIOS_TIMEOUT } from '../../../shared/constants/timeout-constants';

export const getFromAPI = async <T>(
  url: string,
  hasTimeOut: boolean = false
): Promise<T> => {
  console.log(url);
  const { data }: AxiosResponse<T> = await axios.get(
    url,
    hasTimeOut ? DEF_AXIOS_TIMEOUT : undefined
  );
  return data;
};
