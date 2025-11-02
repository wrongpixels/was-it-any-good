import { PersonResponse } from '../../../shared/types/models';
import { apiPaths } from '../../../shared/util/url-builder';
import { getFromAPI } from './common-service';

export const getPersonById = (
  id: string,
  slug?: string
): Promise<PersonResponse> =>
  getFromAPI<PersonResponse>(apiPaths.people.byId(id, slug));
