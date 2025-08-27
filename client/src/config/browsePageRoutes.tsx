import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { routerPaths } from '../utils/url-helper';
import { JSX } from 'react';
import { SortBy, SortDir } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OptIconProps } from '../types/common-props-types';
import IconFilm from '../components/common/icons/media/IconFilm';
import IconShow from '../components/common/icons/media/IconShow';
import IconStar from '../components/common/icons/rating/IconStar';
import IconCrown from '../components/common/icons/badges/IconCrown';
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
  sortBy: SortBy
): JSX.Element | undefined => {
  switch (sortBy) {
    case SortBy.Popularity:
      return <IconStar {...defIconProps} />;
    case SortBy.Rating: {
      switch (searchType) {
        case SearchType.Multi:
          return <IconCrown {...defIconProps} />;
        case SearchType.Film:
          return <IconFilm {...defIconProps} />;
        case SearchType.Show:
          return <IconShow {...defIconProps} />;
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
  sortBy?: SortBy;
  sortDir?: SortDir;
}

const buildPageRoute = ({
  title,
  path,
  subtitle,
  searchType = SearchType.Multi,
  sortBy = SortBy.Popularity,
  sortDir = SortDir.descending,
}: PageRouteBuilderProps): BrowsePageRouterData => {
  return {
    path,
    browseProps: {
      pageTitleOptions: {
        title,
        subtitle,
        icon: getIcon(searchType, sortBy),
      },
      overrideParams: {
        sortBy,
        searchType,
        sortDir,
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
    sortBy: SortBy.Rating,
  }),
  buildPageRoute({
    title: 'Top Rated Films',
    subtitle: 'Highest rated Films in WIAG database',
    path: routerPaths.tops.films.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: 'Top Rated TV Shows',
    subtitle: 'Highest rated Shows in WIAG database',
    path: routerPaths.tops.shows.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Show,
  }),
];
