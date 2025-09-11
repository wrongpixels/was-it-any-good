import { Request } from 'express';
import { WhereOptions, Op, FindAndCountOptions } from 'sequelize';
import {
  UPARAM_QUERY_TYPE,
  UPARAM_PAGE,
  UPARAM_GENRES,
  UPARAM_COUNTRIES,
  UPARAM_YEAR,
  UPARAM_SORT_BY,
  UPARAM_SORT_DIR,
} from '../../../shared/constants/url-param-constants';
import {
  SortBy,
  stringToSortBy,
  SortDir,
  stringToSortDir,
  invertSortDir,
} from '../../../shared/types/browse';
import { CountryCode } from '../../../shared/types/countries';
import { SearchType, arrayToSearchType } from '../../../shared/types/search';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';
import { validateCountries } from '../factories/media-factory';
import { extractQuery } from './search-helpers';

interface URLParams {
  searchTerm: string;
  searchType: SearchType;
  searchPage: number;
  isMulti: boolean;
  genres: string[];
  countries: CountryCode[];
  year?: string;
  sortBy: SortBy;
  sortDir: SortDir;
  where: WhereOptions;
  findAndCountOptions: FindAndCountOptions;
}
//a function that export the parameters sent via query and provides prebuilt 'where' and 'finAndCountOptions'
//for pagination and filtering

export const extractURLParams = (req: Request): URLParams => {
  const searchTerm: string | undefined = req.query.q?.toString().trim() || '';
  const searchType: SearchType =
    arrayToSearchType(extractQuery(req.query[UPARAM_QUERY_TYPE])) ??
    SearchType.Multi;
  const searchPage: number = Number(req.query[UPARAM_PAGE]) || 1;
  const isMulti: boolean = searchType === SearchType.Multi;
  const genres: string[] = extractQuery(req.query[UPARAM_GENRES]);
  const countries: CountryCode[] = validateCountries(
    extractQuery(req.query[UPARAM_COUNTRIES])
  ).filter((c: CountryCode) => c !== 'UNKNOWN');
  const year: string | undefined = req.query[UPARAM_YEAR]?.toString();
  const sortBy: SortBy =
    stringToSortBy(req.query[UPARAM_SORT_BY]?.toString()) || SortBy.Popularity;

  //DESC for strings is actually Z -> A, not really ideal for a default sorting.
  //as all other SortBy are numbers, we simply invert this one
  const defSortDir: SortDir =
    stringToSortDir(req.query[UPARAM_SORT_DIR]?.toString()) || SortDir.Default;
  const sortDir: SortDir =
    sortBy === SortBy.Title ? invertSortDir(defSortDir) : defSortDir;

  //shared filters for years and countries
  const where: WhereOptions = {};
  if (year) {
    where.releaseDate = {
      [Op.between]: [`${year}-01-01`, `${year}-12-31`],
    };
  }
  if (countries.length > 0) {
    where.country = { [Op.overlap]: countries };
  }
  //if we sent a searchTerm, we look for it
  if (searchTerm) {
    where.name = {
      [Op.iLike]: `%${searchTerm}%`,
    };
  }

  //pagination values
  const findAndCountOptions: FindAndCountOptions = {
    order: [[sortBy, sortDir.toUpperCase()]],
    distinct: true,
    limit: PAGE_LENGTH,
    offset: PAGE_LENGTH * (searchPage - 1),
  };

  return {
    searchTerm,
    searchType,
    searchPage,
    isMulti,
    countries,
    year,
    genres,
    sortBy,
    sortDir: defSortDir,
    where,
    findAndCountOptions,
  };
};
