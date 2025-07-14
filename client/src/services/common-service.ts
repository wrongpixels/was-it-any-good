import axios, { AxiosResponse } from 'axios';

export const getFromAPI = async <T>(url: string): Promise<T> => {
  const { data }: AxiosResponse<T> = await axios.get(url);
  return data;
};
