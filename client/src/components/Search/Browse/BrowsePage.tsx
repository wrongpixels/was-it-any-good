import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useBrowseQuery } from '../../../queries/browse-queries';
import UrlQueryBuilder from '../../../utils/url-query-builder';
import PageResults from '../PageResults';
import {
  normalizeMediaSearchParams,
  routerPaths,
} from '../../../utils/url-helper';
import ParamManager from '../../../utils/search-param-manager';
import { searchTypes } from '../../../../../shared/types/search';
import { QueryOpts } from '../../../types/search-browse-types';
import SpinnerPage from '../../common/status/SpinnerPage';
import ErrorPage from '../../common/status/ErrorPage';

const BrowsePage = () => {
  const navigateTo = useNavigate();

  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const currentPage: number = Number(parameters.get('page'));
  const activeTypeParams: string[] = normalizeMediaSearchParams(
    parameters.getAll('m')
  );
  const browseUrl: UrlQueryBuilder = new UrlQueryBuilder();

  const genres: string[] = parameters.getAll('g');
  const countries: string[] = parameters.getAll('c');
  const year = parameters.get('y');
  const typeFilters = new ParamManager(searchTypes, activeTypeParams);
  const buildQuery = ({ newPage }: QueryOpts) => {
    console.log(newPage);
    const url = browseUrl
      .byTypes(typeFilters.getAppliedNames())
      .byGenres(genres)
      .byCountries(countries)
      .byYear(year)
      .toPage(newPage)
      .toString();

    console.log(url);
    return url;
  };
  const currentQuery: string = buildQuery({ newPage: currentPage });
  console.log(currentQuery);
  const { data: browseResults, isLoading } = useBrowseQuery(currentQuery);

  const navigateToCurrentQuery = (replace: boolean = false, page: number = 1) =>
    navigateTo(routerPaths.browse.byQuery(buildQuery({ newPage: page })), {
      replace,
    });

  const navigatePage = (movement: number) => {
    if (!browseResults) {
      return;
    }
    const nextPosition: number = (currentPage || 1) + movement;
    const nextPage: number = Math.min(
      Math.max(1, nextPosition),
      browseResults.totalPages
    );
    navigateToCurrentQuery(false, nextPage);
  };

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
        results={[
          browseResults.filmResults || [],
          browseResults.showResults || [],
        ]}
        totalPages={browseResults?.totalPages}
        totalResults={
          browseResults.totalFilmResults + browseResults.totalShowResults
        }
        page={browseResults?.page}
        navigatePage={navigatePage}
      ></PageResults>
    </>
  );
};

export default BrowsePage;
