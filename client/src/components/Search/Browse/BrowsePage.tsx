import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../PageResults';
import { routerPaths } from '../../../utils/url-helper';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';
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

//BrowsePage is a wildcard component that allows us to browse internal media (not TMDB).
//it can be used combining url queries, which can be overriden with OverrideParams.
//when an override params is provided, the equivalent url one will be ignored.
//this way, the component can also be used for our 'top shows/films/media' etc pages
//while still being compatible with the other params introduced in the url

export interface BrowsePageProps {
  overrideParams?: OverrideParams;
  pageTitleOptions?: BrowsePageTitleOptions;
}

const BrowsePage = ({ overrideParams, pageTitleOptions }: BrowsePageProps) => {
  const basePath = overrideParams?.basePath || routerPaths.browse.query();
  //a hook shared with SearchPage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters.
  //override params are passed here.
  const {
    currentQuery,
    navigatePages,
    navigateToPage,
    currentPage,
    genres,
    operationString,
  } = useUrlQueryManager({
    basePath,
    overrideParams,
  });
  const {
    data: browseResults,
    isLoading,
    isError,
  } = useBrowseQuery(currentQuery);
  const { data: genreResults, isLoading: genresLoading } =
    useGenresQuery(genres);
  console.log(browseResults);

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
    <div key={currentQuery} className="flex flex-col flex-1">
      {
        <span className="mb-2">
          <EntryTitle
            title={pageTitleOptions?.title || operationString}
            subtitle={pageTitleOptions?.subtitle}
            icon={pageTitleOptions?.icon}
          />
        </span>
      }
      {(isLoading || genresLoading) && (
        <SpinnerPage text={`Browsing WIAG...`} />
      )}
      <div className="flex flex-col flex-1 mt-1">
        <PageResults
          results={browseResults}
          navigatePages={navigatePages}
          badgeType={
            !!overrideParams?.orderBy ? BadgeType.RankBadge : BadgeType.None
          }
        ></PageResults>
      </div>
    </div>
  );
};

export default BrowsePage;
