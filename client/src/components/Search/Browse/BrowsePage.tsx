import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useBrowseQuery } from '../../../queries/browse-queries';
import UrlQueryBuilder from '../../../utils/url-query-builder';
import SearchPageResults from '../SearchPageResults';
import { normalizeMediaSearchParams } from '../../../utils/url-helper';
import ParamManager from '../../../utils/search-param-manager';
import { searchTypes } from '../../../../../shared/types/search';
import { SearchQueryOpts } from '../../../types/search-browse-types';

const BrowsePage = () => {
  const navigateTo = useNavigate();

  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const currentPage: number = Number(parameters.get('page'));
  const activeTypeParams: string[] = normalizeMediaSearchParams(
    parameters.getAll('m')
  );
  const browseUrl: UrlQueryBuilder = new UrlQueryBuilder();

  const genre = parameters.get('g');
  const year = parameters.get('y');
  const typeFilters = new ParamManager(searchTypes, activeTypeParams);
  const buildQuery = ({ newPage }: SearchQueryOpts) => {
    console.log(newPage);
    const url = browseUrl
      .byTypes(typeFilters.getAppliedNames())
      .byGenre(Number(genre))
      .toPage(newPage)
      .toString();

    console.log(url);

    return url;
  };
  const { data: searchResults, isLoading } = useBrowseQuery(buildQuery());
  return <></>;
};

export default BrowsePage;
