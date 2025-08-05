import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { routerPaths } from '../utils/url-helper';
import { JSX } from 'react';
import { OrderBy, Sorting } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OptIconProps } from '../types/common-props-types';
import FilmIcon from '../components/common/icons/FilmIcon';
import ShowIcon from '../components/common/icons/ShowIcon';
import StarIcon from '../components/common/icons/Rating/StarIcon';
import CrownIcon from '../components/common/icons/Crown';
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
      return <StarIcon {...defIconProps} />;
    case OrderBy.Rating: {
      switch (searchType) {
        case SearchType.Multi:
          return <CrownIcon {...defIconProps} />;
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
  subtitle?: string;
  searchType?: SearchType;
  orderBy?: OrderBy;
  sort?: Sorting;
}

const buildPageRoute = ({
  title,
  path,
  subtitle,
  searchType = SearchType.Multi,
  orderBy = OrderBy.Popularity,
  sort = Sorting.descending,
}: PageRouteBuilderProps): BrowsePageRouterData => {
  return {
    path,
    browseProps: {
      pageTitleOptions: {
        title,
        subtitle,
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
    title: 'Popular Media',
    subtitle: 'Most popular media in WIAG database',
    path: routerPaths.popular.multi.base(),
  }),
  buildPageRoute({
    title: 'Top Rated Media',
    subtitle: 'Highest rated media in WIAG database',

    path: routerPaths.tops.multi.base(),
    orderBy: OrderBy.Rating,
  }),
  buildPageRoute({
    title: 'Top Rated Films',
    subtitle: 'Highest rated Films in WIAG database',
    path: routerPaths.tops.films.base(),
    orderBy: OrderBy.Rating,
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: 'Top Rated TV Shows',
    subtitle: 'Highest rated Shows in WIAG database',
    path: routerPaths.tops.shows.base(),
    orderBy: OrderBy.Rating,
    searchType: SearchType.Show,
  }),
];
