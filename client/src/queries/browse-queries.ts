import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { IndexMediaResults } from '../../../shared/types/models';
import { QUERY_KEY_BROWSE } from '../constants/query-key-constants';
import { apiPaths } from '../../../shared/util/url-builder';

interface BrowseQueryOptions {
  query: string;
  apiPath?: string;
}

const buildQueryKey = (apiPath: string): string => {
  //if it's the regular browsePath, we use the default key
  if (apiPath === apiPaths.browse.base) {
    return QUERY_KEY_BROWSE;
  }
  const i: number = apiPath.lastIndexOf('/');
  //we get the last part of the apiPath (eg: 'watchlist') or the full path
  return i === -1 ? apiPath : apiPath.slice(i + 1);
};

export const useBrowseQuery = ({
  query,
  apiPath: overridePath,
}: BrowseQueryOptions): UseQueryResult<IndexMediaResults, Error> => {
  //if we didn't override the browse path, we use the default one
  const apiPath: string = overridePath || apiPaths.browse.base;
  return useQuery({
    queryKey: [buildQueryKey(apiPath), query],
    retry: false,
    queryFn: () => getBrowseResults(query, apiPath),
  });
};
