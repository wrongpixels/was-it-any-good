import axios from 'axios';
import { FilmResponse } from '../../../shared/types/models';

export const getById = async (id: string): Promise<FilmResponse | null> => {
  const film: FilmResponse | null = await axios.get(`/api/films/${id}`);
  return film;
};
