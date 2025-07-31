import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../PageResults';
import { routerPaths } from '../../../utils/url-helper';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';

const BrowsePage = () => {
  const { currentQuery, navigatePage } = useUrlQueryManager(
    routerPaths.browse.query()
  );
  const { data: browseResults, isLoading } = useBrowseQuery(currentQuery);
  console.log(browseResults);

  if (isLoading) {
    return <>{isLoading && <SpinnerPage text={`Browsing WIAG...`} />}</>;
  }
  if (!browseResults) {
    return <ErrorPage />;
  }

  return (
    <>
      {isLoading && <SpinnerPage text={`Browsing WIAG...`} />}
      <PageResults
        results={browseResults}
        navigatePage={navigatePage}
        showBadge={true}
      ></PageResults>
    </>
  );
};

export default BrowsePage;
