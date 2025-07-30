import { IndexMediaResponse } from '../../../shared/types/models';

export const PAGE_LENGTH: number = 20;

export const EMPTY_RESULTS: IndexMediaResponse = {
  page: 1,
  totalResults: 0,
  totalPages: 0,
  indexMedia: [],
};
