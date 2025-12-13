import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { IndexMediaResults } from '../../../shared/types/models';
import { QUERY_KEY_BROWSE } from '../constants/query-key-constants';
import { apiPaths } from '../../../shared/util/url-builder';

interface BrowseQueryOptions {
  query: string;
  apiPath?: string;
  queryKey?: string[];
}

export const buildBrowseQueryKey = ({
  apiPath = apiPaths.browse.base,
  query,
}: BrowseQueryOptions): string[] => {
  //if it's the regular browsePath, we use the default key
  let finalPath: string = QUERY_KEY_BROWSE;
  if (apiPath !== apiPaths.browse.base) {
    const i: number = apiPath.indexOf('/');
    //we get the last part of the apiPath (eg: 'watchlist') or the full path
    finalPath =
      i === -1
        ? apiPath
        : apiPath.slice(i + 1, apiPath.length).replace('api/', '');
  }
  return [finalPath, query];
};

export const useBrowseQuery = ({
  query,
  apiPath: overridePath,
  queryKey,
}: BrowseQueryOptions): UseQueryResult<IndexMediaResults, Error> => {
  const apiPath: string = overridePath || apiPaths.browse.base;
  return useQuery({
    //if we didn't already send the query key, we build it now
    queryKey: queryKey ?? buildBrowseQueryKey({ apiPath, query }),
    retry: true,
    queryFn: () => getBrowseResults(query, apiPath),
  });
};
