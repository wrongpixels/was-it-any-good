import {
  buildBrowseQueryKey,
  useBrowseQuery,
} from '../../../queries/browse-queries';
import PageResults from '../Results/PageResults';
import ErrorPage from '../../Common/Status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';
import { useEffect } from 'react';
import EntryTitle from '../../EntryTitle';
import {
  BadgeType,
  BrowsePageTitleOptions,
  QueryToUse,
} from '../../../types/search-browse-types';
import { setPageInfo } from '../../../utils/page-info-setter';
import { useGenresQuery } from '../../../queries/genre-queries';
import { getBrowseOperation } from '../../../utils/common-format-helper';
import LoadingCards from '../Loading/LoadingSearch';
import { OverrideParams } from '../../../../../shared/types/search-browse';
import { useMyVotesQuery } from '../../../queries/my-votes-queries';
import { OverrideSortOptions } from '../Results/PageResultsSort';
import useAuthProtection from '../../../hooks/use-auth-protection';
import { clientPaths } from '../../../../../shared/util/url-builder';

import { setBrowsePageSeo } from '../../../utils/page-seo-helpers';
import { SortBy } from '../../../../../shared/types/browse';
import { DEF_SORT_BY } from '../../../../../shared/constants/url-param-constants';

//BrowsePage is a wildcard component that allows us to browse internal media (not TMDB).
//it can be used combining url queries, which can be overridden with OverrideParams.
//when an override params is provided, the equivalent url one will be ignored.
//this way, the component can also be used for our 'top shows/films/media' etc pages
//while still being compatible with the other params introduced in the url

export interface BrowsePageProps {
  overrideParams?: OverrideParams;
  overrideSortOptions?: OverrideSortOptions;
  pageTitleOptions?: BrowsePageTitleOptions;
  apiPath?: string;
  authReq?: boolean;
  queryToUse?: QueryToUse;
}

const BrowsePage = ({
  overrideParams,
  overrideSortOptions,
  pageTitleOptions,
  authReq = false,
  apiPath,
  queryToUse = 'browse',
}: BrowsePageProps) => {
  const basePath = overrideParams?.basePath || clientPaths.browse.base;
  //if we are accessing user data, we check for a valid session with this hook:
  useAuthProtection({ condition: authReq });

  //a hook shared with SearchPage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters.
  //override params are passed here.
  const {
    urlParams,
    currentQuery,
    navigatePages,
    navigateToPage,
    navigateToQuery,
  } = useUrlQueryManager({
    basePath,
    overrideParams,
  });
  const { searchPage, genres } = urlParams;
  //we calculate here the query key of the results so we can pass it
  //to the SearchCards and then be able to modify/reset the query
  const queryKey: string[] = buildBrowseQueryKey({
    apiPath,
    query: currentQuery,
  });
  const {
    data: browseResults,
    isLoading,
    isError,
  } = queryToUse === 'votes'
    ? useMyVotesQuery(currentQuery)
    : useBrowseQuery({ query: currentQuery, apiPath, queryKey });

  const { data: genreResults, isAnyLoading } = useGenresQuery(genres);

  // console.log(browseResults);

  //to avoid setting a url bigger than totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      searchPage < 0 ||
      (browseResults && browseResults.totalPages < Number(searchPage))
    ) {
      navigateToPage(browseResults?.totalPages || 1);
    }
  }, [browseResults]);

  if (isError || browseResults === null) {
    return <ErrorPage />;
  }
  //if genres are still loading, we set a default title.
  //when populated, we will create a specific title with all our parameters

  const operationString: string | undefined = isAnyLoading
    ? undefined
    : getBrowseOperation({ urlParams, genreResults });

  if (pageTitleOptions) {
    //if it's one of our BaseRoutes (Film, Top Media...) we set their advanced list SEO, if not, we'll just change the title.

    //to avoid setting items in the wrong order, we don't send the results if any additional
    //query is applied
    const hasAdditionalQueries: boolean = currentQuery.includes('&');
    setBrowsePageSeo({
      title: pageTitleOptions.title,
      page: urlParams.searchPage,
      allItems:
        !hasAdditionalQueries && browseResults?.resultsType === 'browse'
          ? browseResults?.indexMedia
          : undefined,
    });
  } else if (operationString) {
    setPageInfo({
      title: operationString,
    });
  }
  const activeSortBy: SortBy | null =
    urlParams.sortBy || overrideParams?.sortBy || DEF_SORT_BY;
  const badgeType: BadgeType =
    activeSortBy &&
    [SortBy.Popularity, SortBy.Rating, SortBy.UserScore].includes(activeSortBy)
      ? BadgeType.RankBadge
      : BadgeType.IndexBadge;
  return (
    <div key={currentQuery} className="flex flex-col h-full">
      {
        <span className="mb-2">
          <EntryTitle
            title={pageTitleOptions?.title || operationString}
            subtitle={pageTitleOptions?.subtitle}
            icon={pageTitleOptions?.icon}
          />
        </span>
      }
      {(isLoading && (
        <LoadingCards showNavBar={true} loadTitle={'Browsing WIAG'} />
      )) || (
        <>
          <div className="flex flex-col flex-1 mt-1 h-full">
            <PageResults
              isLoading={isLoading}
              navigateToQuery={navigateToQuery}
              results={browseResults}
              queryKey={queryKey}
              urlParams={urlParams}
              navigatePages={navigatePages}
              badgeType={badgeType}
              overrideSortOptions={overrideSortOptions}
              overrideParams={overrideParams}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BrowsePage;
