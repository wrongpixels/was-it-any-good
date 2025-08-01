import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../PageResults';
import { routerPaths } from '../../../utils/url-helper';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';
import { useEffect } from 'react';
import EntryTitle from '../../EntryTitle';
import { SearchType } from '../../../../../shared/types/search';
import { OrderBy } from '../../../../../shared/types/browse';
import { getBrowseTitle } from '../../../utils/browse-helper';

interface BrowsePageProps {
  orderBy?: OrderBy;
  searchType?: SearchType;
}

const BrowsePage = ({ searchType, orderBy }: BrowsePageProps) => {
  const title: string | null = getBrowseTitle(searchType, orderBy);

  //a hook shared with SearchPage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters
  const { currentQuery, navigatePages, navigateToPage, currentPage } =
    useUrlQueryManager(routerPaths.browse.query());
  const {
    data: browseResults,
    isLoading,
    isError,
  } = useBrowseQuery(currentQuery);
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

  return (
    <div key={title}>
      {title && (
        <div className="mb-8">
          <EntryTitle title={title} />
        </div>
      )}
      {isLoading && <SpinnerPage text={`Browsing WIAG...`} />}
      <PageResults
        results={browseResults}
        navigatePages={navigatePages}
        showBadge={true}
      ></PageResults>
    </div>
  );
};

export default BrowsePage;
