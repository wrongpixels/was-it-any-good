import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../Results/PageResults';
import { routerPaths } from '../../../utils/url-helper';
import ErrorPage from '../../Common/Status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';
import { useEffect } from 'react';
import EntryTitle from '../../EntryTitle';
import {
  BadgeType,
  BrowsePageTitleOptions,
  OverrideParams,
} from '../../../types/search-browse-types';
import { setPageInfo } from '../../../utils/page-info-setter';
import { useGenresQuery } from '../../../queries/genre-queries';
import { getBrowseOperation } from '../../../utils/common-format-helper';
import LoadingCards from '../Loading/LoadingSearch';
import { overrideParamsToOverrideSort } from '../../../utils/browse-helper';

//BrowsePage is a wildcard component that allows us to browse internal media (not TMDB).
//it can be used combining url queries, which can be overridden with OverrideParams.
//when an override params is provided, the equivalent url one will be ignored.
//this way, the component can also be used for our 'top shows/films/media' etc pages
//while still being compatible with the other params introduced in the url

export interface BrowsePageProps {
  overrideParams?: OverrideParams;
  pageTitleOptions?: BrowsePageTitleOptions;
}

const BrowsePage = ({ overrideParams, pageTitleOptions }: BrowsePageProps) => {
  const basePath = overrideParams?.basePath || routerPaths.browse.base;
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
  const { currentPage, genres } = urlParams;
  const {
    data: browseResults,
    isFetching,
    isLoading,
    isError,
  } = useBrowseQuery(currentQuery);
  const { data: genreResults, isAnyLoading } = useGenresQuery(genres);

  //to avoid setting a url bigger than totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      currentPage < 0 ||
      (browseResults && browseResults.totalPages < Number(currentPage))
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
    setPageInfo({
      title: pageTitleOptions.tabTitle || pageTitleOptions.title,
    });
  } else if (operationString) {
    setPageInfo({
      title: operationString,
    });
  }

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
      {((isLoading || isFetching) && (
        <LoadingCards
          showNavBar={true}
          loadTitle={'Browsing WIAG...'}
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
              badgeType={BadgeType.RankBadge}
              overrideSortOptions={overrideParamsToOverrideSort(overrideParams)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BrowsePage;
