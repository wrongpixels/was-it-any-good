import { useBrowseQuery } from '../../../queries/browse-queries';
import PageResults from '../PageResults';
import { routerPaths } from '../../../utils/url-helper';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';
import useUrlQueryManager from '../../../hooks/use-url-query-manager';
import { JSX, useEffect } from 'react';
import EntryTitle from '../../EntryTitle';
import { OverrideParams } from '../../../types/search-browse-types';

//BrowsePage is a wildcard component that allows us to browse internal media (not TMDB).
//it can be used combining url queries, which can be overriden with OverrideParams.
//when an override params is provided, the equivalent url one will be ignored.
//this way, the component can also be used for our 'top shows/films/media' etc pages
//while still being compatible with the other params introduced in the url

interface BrowsePageCustomization {
  //title and icon allows us to customize the BrowsePage for special pages
  title: string;
  icon?: JSX.Element;
}

interface BrowsePageProps {
  overrideParams?: OverrideParams;
  customization?: BrowsePageCustomization;
}

const BrowsePage = ({ overrideParams, customization }: BrowsePageProps) => {
  const title: string | undefined = customization?.title;
  const basePath = overrideParams?.basePath || routerPaths.browse.query();
  //a hook shared with SearchPage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters.
  //verride params are passed here.
  const { currentQuery, navigatePages, navigateToPage, currentPage } =
    useUrlQueryManager({
      basePath,
      overrideParams,
    });
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
