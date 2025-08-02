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
import { OverrideParams, QueryOpts } from '../types/search-browse-types';
import ParamManager from '../utils/search-param-manager';
import { normalizeQueryTypeParams } from '../utils/url-helper';
import UrlQueryBuilder from '../utils/url-query-builder';

//if the manager receives override params, they'll be used ignoring
//equivalent url params.
interface UrlQueryManagerOptions {
  basePath: string;
  overrideParams?: OverrideParams;
}

const useUrlQueryManager = ({
  basePath,
  overrideParams,
}: UrlQueryManagerOptions) => {
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
      //if we sent an override search type, it will replace the ones just added.
      //if undefined, it will just be skipped keeping them.
      .byType(overrideParams?.searchType)
      .byGenres(genres)
      .byCountries(countries)
      .byYear(year)
      .toPage(newPage)
      .orderBy(overrideParams?.orderBy || orderBy)
      .sortBy(overrideParams?.sort || sort)
      .toString();
    return url;
  };

  //the current query after filtering invalid params
  const currentQuery: string = buildQuery({ newPage: currentPage });
  console.log(currentQuery);

  //to build a new query with a new term, if provided, or reuse the current one.
  //if page is not provided, we default to page 1.
  const navigateToQuery = (
    newTerm?: string,
    page?: number,
    replace: boolean = false
  ) =>
    navigateTo(`${basePath}?${buildQuery({ newTerm, newPage: page })}`, {
      replace,
    });

  //to navigate to a version of the current query term
  const navigateToCurrentQuery = (replace: boolean = false, page: number = 1) =>
    navigateToQuery(undefined, page, replace);

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
    navigateToNewTerm: navigateToQuery,
    navigateToPage,
    navigatePages,
  };
};

export default useUrlQueryManager;
