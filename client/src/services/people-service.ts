import { PersonResponse } from '../../../shared/types/models';
import { getById } from './common-service';

const PEOPLE_API: string = 'people';

export const getPersonById = (id: string): Promise<PersonResponse> =>
  getById<PersonResponse>(PEOPLE_API, id);
