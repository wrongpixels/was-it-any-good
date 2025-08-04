import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { routerPaths } from '../utils/url-helper';
import TrendingIcon from '../components/common/icons/TrendingIcon';
import { JSX } from 'react';
import { OrderBy, Sorting } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OptIconProps } from '../types/common-props-types';
import FilmIcon from '../components/common/icons/FilmIcon';
import ShowIcon from '../components/common/icons/ShowIcon';
import StarIcon from '../components/common/icons/Rating/StarIcon';
export interface BrowsePageRouterData {
  path: string;
  browseProps: BrowsePageProps;
}

const defIconProps: OptIconProps = {
  height: 30,
  width: 30,
  className: 'text-gold',
};

const getIcon = (
  searchType: SearchType,
  orderBy: OrderBy
): JSX.Element | undefined => {
  switch (orderBy) {
    case OrderBy.Popularity:
      return <TrendingIcon {...defIconProps} />;
    case OrderBy.Rating: {
      switch (searchType) {
        case SearchType.Multi:
          return <StarIcon {...defIconProps} />;
        case SearchType.Film:
          return <FilmIcon {...defIconProps} />;
        case SearchType.Show:
          return <ShowIcon {...defIconProps} />;
        default:
          return undefined;
      }
    }
    default:
      return undefined;
  }
};

interface PageRouteBuilderProps {
  title: string;
  path: string;
  searchType?: SearchType;
  orderBy?: OrderBy;
  sort?: Sorting;
}

const buildPageRoute = ({
  title,
  path,
  searchType = SearchType.Multi,
  orderBy = OrderBy.Popularity,
  sort = Sorting.descending,
}: PageRouteBuilderProps): BrowsePageRouterData => {
  return {
    path,
    browseProps: {
      pageTitleOptions: {
        title,
        icon: getIcon(searchType, orderBy),
      },
      overrideParams: {
        orderBy,
        searchType,
        sort,
        basePath: path,
      },
    },
  };
};

export const browsePageRoutes: BrowsePageRouterData[] = [
  buildPageRoute({
    title: 'Trending Now',
    path: routerPaths.trending.base,
  }),
  buildPageRoute({
    title: 'Popular Media',
    path: routerPaths.popular.multi.base(),
  }),
  buildPageRoute({
    title: 'Top Rated Media',
    path: routerPaths.tops.multi.base(),
    orderBy: OrderBy.Rating,
  }),
  buildPageRoute({
    title: 'Top Rated Films',
    path: routerPaths.tops.films.base(),
    orderBy: OrderBy.Rating,
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: 'Top Rated TV Shows',
    path: routerPaths.tops.shows.base(),
    orderBy: OrderBy.Rating,
    searchType: SearchType.Show,
  }),
];
