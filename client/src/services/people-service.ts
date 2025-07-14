import { PersonResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getPersonById = (id: string): Promise<PersonResponse> =>
  getFromAPI<PersonResponse>(apiPaths.people.byId(id));
