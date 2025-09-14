//a hook that automatically reads the active url queries
//and provides ways to handle them and navigate them
import {
  useNavigate,
  SetURLSearchParams,
  useSearchParams,
} from 'react-router-dom';
import { SearchType, searchTypes } from '../../../shared/types/search';
import { QueryOpts } from '../types/search-browse-types';
import ParamManager from '../utils/search-param-manager';
import { extractURLParameters } from '../utils/url-helper';
import UrlQueryBuilder from '../utils/url-query-builder';
import { useCallback, useMemo } from 'react';
import {
  OverrideParams,
  URLParameters,
} from '../../../shared/types/search-browse';

//if the manager receives override params, they'll be used ignoring
//equivalent url params.
interface UrlQueryManagerOptions {
  basePath: string;
  overrideParams?: OverrideParams;
}

export interface NavigateToQueryOptions {
  page?: number;
  replace?: boolean;
  newTerm?: string;
  overrideParams?: OverrideParams;
}

const useUrlQueryManager = ({
  basePath,
  overrideParams,
}: UrlQueryManagerOptions) => {
  const navigateTo = useNavigate();

  const queryBuilder: UrlQueryBuilder = new UrlQueryBuilder();
  //we extract and normalize all valid query params in the url
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const urlParams: URLParameters = extractURLParameters(
    parameters,
    overrideParams
  );

  const queryTypeManager = new ParamManager(
    searchTypes.filter((t: string) => t !== SearchType.Multi),
    urlParams.queryType
  );

  //the function that generates a valid query from params
  const buildQuery = useCallback(
    ({
      newTerm: newQuery,
      newPage,
      overrideParams: localOverride,
    }: QueryOpts) => {
      console.log(
        localOverride?.searchType,
        overrideParams?.searchType,
        queryTypeManager.getAppliedNames()
      );

      const url: string = queryBuilder
        .clean()
        .byTerm(newQuery || urlParams.searchTerm)
        .byTypes(queryTypeManager.getAppliedNames())
        //if we sent an override search type, it will replace the ones just added.
        //if undefined, it will just be skipped keeping them.
        .byType(localOverride?.searchType || overrideParams?.searchType)
        .byGenres(urlParams.genres)
        .byCountries(urlParams.countries)
        .byYear(urlParams.year)
        .toPage(newPage)
        .sortBy(
          localOverride?.sortBy || urlParams.sortBy || overrideParams?.sortBy
        )
        .sortDir(
          localOverride?.sortDir || urlParams.sortDir || overrideParams?.sortDir
        )
        .toString();
      console.log(
        localOverride?.sortBy,
        urlParams.sortBy,
        overrideParams?.sortBy
      );
      return url;
    },

    [urlParams, queryTypeManager, overrideParams, queryBuilder]
  );

  //the current query after filtering invalid params
  const currentQuery: string = useMemo(
    () => buildQuery({ newPage: urlParams.searchPage }),
    [buildQuery, urlParams.searchPage]
  );
  console.log(currentQuery);

  //to build a new query with a new term, if provided, or reuse the current one.
  //if page is not provided, we default to page 1.
  //an option to override queries is included.
  const navigateToQuery = useCallback(
    ({
      newTerm,
      page,
      replace = false,
      overrideParams,
    }: NavigateToQueryOptions) => {
      navigateTo(
        `${basePath}?${buildQuery({ newTerm, newPage: page, overrideParams })}`,
        {
          replace,
        }
      );
    },
    [navigateTo, basePath, buildQuery]
  );

  //to go to a specific page
  const navigateToPage = useCallback(
    (page: number) => {
      if (!overrideParams) {
        navigateToQuery({ page, replace: false });
      } else {
        //if we're overriding parameters, like 'top/shows', we simply set the page query
        navigateTo(`${page <= 1 ? basePath : `${basePath}?page=${page}`}`);
      }
    },
    [navigateToQuery]
  );

  //to move pages in any direction (-2, 1...)
  const navigatePages = useCallback(
    (movement: number) => {
      const nextPosition: number = (urlParams.searchPage || 1) + movement;
      navigateToPage(nextPosition);
    },
    [urlParams.searchPage, navigateToPage]
  );

  return useMemo(
    () => ({
      currentQuery,
      urlParams,
      queryTypeManager,
      navigateToQuery,
      navigateToPage,
      navigatePages,
    }),
    [
      currentQuery,
      urlParams,
      queryTypeManager,
      navigateToQuery,
      navigateToPage,
      navigatePages,
    ]
  );
};
export default useUrlQueryManager;
