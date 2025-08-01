import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../PageResults';
import { routerPaths } from '../../../utils/url-helper';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';
import { useEffect } from 'react';

const BrowsePage = () => {
  //a hook shared with SearchPage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters
  const { currentQuery, navigatePages, navigateToPage, currentPage } =
    useUrlQueryManager(routerPaths.browse.query());
  const { data: browseResults, isLoading } = useBrowseQuery(currentQuery);
  console.log(browseResults);

  //to avoid setting a url bigger than totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      currentPage <= 0 ||
      (browseResults && browseResults.totalPages < Number(currentPage))
    ) {
      navigateToPage(browseResults?.totalPages || 1);
    }
  }, [browseResults]);

  if (isLoading) {
    return <>{isLoading && <SpinnerPage text={'Browsing WIAG...'} />}</>;
  }
  if (!browseResults) {
    return <ErrorPage />;
  }

  return (
    <>
      {isLoading && <SpinnerPage text={`Browsing WIAG...`} />}
      <PageResults
        results={browseResults}
        navigatePages={navigatePages}
        showBadge={true}
      ></PageResults>
    </>
  );
};

export default BrowsePage;
