//a hook that automatically reads the active url queries
//and provides ways to handle them and navigate them
import {
  useNavigate,
  SetURLSearchParams,
  useSearchParams,
} from 'react-router-dom';
import {
  OrderBy,
  stringToOrderBy,
  Sorting,
  stringToSorting,
} from '../../../shared/types/browse';
import { SearchType, searchTypes } from '../../../shared/types/search';
import { QueryOpts } from '../types/search-browse-types';
import ParamManager from '../utils/search-param-manager';
import { normalizeQueryTypeParams } from '../utils/url-helper';
import UrlQueryBuilder from '../utils/url-query-builder';

const useUrlQueryManager = (basePath: string) => {
  const navigateTo = useNavigate();
  const queryBuilder: UrlQueryBuilder = new UrlQueryBuilder();

  //we detect all valid query params used in the url
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const searchTerm: string | null = parameters.get('q');
  const currentPage: number = Number(parameters.get('page'));
  const queryType: string[] = normalizeQueryTypeParams(parameters.getAll('m'));
  const queryTypeManager = new ParamManager(
    searchTypes.filter((t: string) => t !== SearchType.Multi),
    queryType
  );
  const genres: string[] = parameters.getAll('g');
  const countries: string[] = parameters.getAll('c');
  const year = parameters.get('y');
  const orderBy: OrderBy | undefined = stringToOrderBy(
    parameters.get('orderby')
  );
  const sort: Sorting | undefined = stringToSorting(parameters.get('sort'));

  //the function that generates a valid query from params
  const buildQuery = ({ newTerm: newQuery, newPage }: QueryOpts) => {
    const url: string = queryBuilder
      .byTerm(newQuery || searchTerm)
      .byTypes(queryTypeManager.getAppliedNames())
      .byGenres(genres)
      .byCountries(countries)
      .byYear(year)
      .toPage(newPage)
      .orderBy(orderBy)
      .sortBy(sort)
      .toString();
    return url;
  };

  //the current query after filtering invalid params
  const currentQuery: string = buildQuery({ newPage: currentPage });
  console.log(currentQuery);

  //to navigate to a version of the current query
  const navigateToCurrentQuery = (replace: boolean = false, page: number = 1) =>
    navigateTo(`${basePath}${buildQuery({ newPage: page })}`, {
      replace,
    });

  //to navigate to page 1 of a new search term
  const navigateToNewTerm = (
    newTerm: string | undefined,
    replace: boolean = false
  ) =>
    navigateTo(`${basePath}${buildQuery({ newTerm: newTerm })}`, {
      replace,
    });

  //to go to a specific page
  const navigateToPage = (page: number) => {
    navigateToCurrentQuery(false, page);
  };

  //to move pages in any direction (-2, 1...)
  const navigatePages = (movement: number) => {
    const nextPosition: number = (currentPage || 1) + movement;
    navigateToPage(nextPosition);
  };

  //To avoid setting a page url bigger than our results

  return {
    searchTerm,
    currentQuery,
    currentPage,
    queryTypeManager,
    navigateToNewTerm,
    navigateToPage,
    navigatePages,
  };
};

export default useUrlQueryManager;
