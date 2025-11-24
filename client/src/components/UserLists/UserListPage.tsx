import { BrowsePageProps } from '../Search/Browse/BrowsePage';
import { useActiveUserWatchlistQuery } from '../../queries/watchlist-queries';
import { useEffect } from 'react';
import { clientPaths } from '../../../../shared/util/url-builder';
import useAuthProtection from '../../hooks/use-auth-protection';
import useUrlQueryManager from '../../hooks/use-url-query-manager';
import { BadgeType } from '../../types/search-browse-types';
import { setBrowsePageSeo } from '../../utils/page-seo-helpers';
import ErrorPage from '../Common/Status/ErrorPage';
import EntryTitle from '../EntryTitle';
import LoadingCards from '../Search/Loading/LoadingSearch';
import PageResults from '../Search/Results/PageResults';
import { useAuth } from '../../hooks/use-auth';
import { SortBy } from '../../../../shared/types/browse';

//BrowsePage is a wildcard component that allows us to browse internal media (not TMDB).
//it can be used combining url queries, which can be overridden with OverrideParams.
//when an override params is provided, the equivalent url one will be ignored.
//this way, the component can also be used for our 'top shows/films/media' etc pages
//while still being compatible with the other params introduced in the url

const UserListPage = ({
  overrideParams,
  overrideSortOptions,
  pageTitleOptions,
}: BrowsePageProps) => {
  const basePath = overrideParams?.basePath || clientPaths.browse.base;
  //if we are accessing user data, we check for a valid session with this hook:
  //in this case, it will only enforce it if we are checking user votes.
  useAuthProtection({});

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
  const { searchPage } = urlParams;
  const { session } = useAuth();
  if (!session?.userId) {
    return ErrorPage({ context: 'You need to be logged in to see this page!' });
  }
  const {
    data: browseResults,
    isFetching,
    isLoading,
    isError,
  } = useActiveUserWatchlistQuery(session?.userId, '');

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
  }

  const badgeType: BadgeType =
    urlParams.sortBy &&
    [SortBy.Popularity, SortBy.Rating, SortBy.UserScore].includes(
      urlParams.sortBy
    )
      ? BadgeType.RankBadge
      : BadgeType.IndexBadge;

  return (
    <div key={currentQuery} className="flex flex-col h-full">
      {
        <span className="mb-2">
          <EntryTitle
            title={pageTitleOptions?.title}
            subtitle={pageTitleOptions?.subtitle}
            icon={pageTitleOptions?.icon}
          />
        </span>
      }
      {((isLoading || isFetching) && (
        <LoadingCards
          showNavBar={true}
          loadTitle={'Browsing WIAG'}
          placeholderCount={browseResults?.indexMedia.length}
        />
      )) || (
        <>
          <div className="flex flex-col flex-1 mt-1 h-full">
            <PageResults
              isLoading={isFetching}
              navigateToQuery={navigateToQuery}
              results={browseResults}
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

export default UserListPage;
