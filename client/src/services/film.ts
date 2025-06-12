import axios, { AxiosResponse } from 'axios';
import { FilmResponse } from '../../../shared/types/models';

export const getById = async (id: string): Promise<FilmResponse | null> => {
  try {
    const response: AxiosResponse<FilmResponse> = await axios.get<FilmResponse>(
      `/api/films/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch film with id ${id}:`, error);
    return null;
  }
};
