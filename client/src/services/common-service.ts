import axios, { AxiosResponse } from 'axios';

export const getById = async <T>(
  endpoint: string,
  id: string | number = ''
): Promise<T> => {
  const response: AxiosResponse<T> = await axios.get(`/api/${endpoint}/${id}`);
  return response.data;
};
