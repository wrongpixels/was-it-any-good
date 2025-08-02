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

interface BrowsePropsBuilder {
  title: string;
  searchType?: SearchType;
  orderBy?: OrderBy;
  sort?: Sorting;
}

const buildProps = ({
  title,
  searchType = SearchType.Multi,
  orderBy = OrderBy.Popularity,
  sort = Sorting.descending,
}: BrowsePropsBuilder): BrowsePageProps => {
  return {
    pageTitleOptions: {
      title,
      icon: getIcon(searchType, orderBy),
    },
    overrideParams: {
      orderBy,
      searchType,
      sort,
    },
  };
};

export const browsePageRoutes: BrowsePageRouterData[] = [
  {
    path: routerPaths.popular.multi.base(),
    browseProps: buildProps({ title: 'Most Popular Media' }),
  },
  {
    path: routerPaths.tops.multi.base(),
    browseProps: buildProps({
      title: 'Top Rated Media',
      orderBy: OrderBy.Rating,
    }),
  },
  {
    path: routerPaths.tops.films.base(),
    browseProps: buildProps({
      title: 'Top Rated Films',
      orderBy: OrderBy.Rating,
      searchType: SearchType.Film,
    }),
  },
  {
    path: routerPaths.tops.shows.base(),
    browseProps: buildProps({
      title: 'Top Rated TV Shows',
      orderBy: OrderBy.Rating,
      searchType: SearchType.Show,
    }),
  },
];
