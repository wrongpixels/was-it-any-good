import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { routerPaths } from '../utils/url-helper';
import { JSX } from 'react';
import { SortBy, SortDir } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OptIconProps } from '../types/common-props-types';
import IconCrown from '../components/Common/Icons/Badges/IconCrown';
import IconFilm from '../components/Common/Icons/Media/IconFilm';
import IconShow from '../components/Common/Icons/Media/IconShow';
import IconStar from '../components/Common/Icons/Ratings/IconStar';
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
  icon?: JSX.Element;
  subtitle?: string;
  searchType?: SearchType;
  sortBy?: SortBy;
  sortDir?: SortDir;
}

const buildPageRoute = ({
  title,
  path,
  subtitle,
  icon,
  searchType = SearchType.Multi,
  sortBy = SortBy.Rating,
}: PageRouteBuilderProps): BrowsePageRouterData => {
  return {
    path,
    browseProps: {
      pageTitleOptions: {
        title,
        subtitle,
        icon: icon ?? getIcon(searchType, sortBy),
      },
      overrideParams: {
        sortBy: sortBy === SortBy.Rating ? undefined : sortBy,
        searchType,
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
    sortBy: SortBy.Popularity,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: 'Top Rated Media',
    subtitle: 'Highest rated media in WIAG database',
    path: routerPaths.tops.multi.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: 'Films',
    subtitle: 'Films in WIAG database',
    path: routerPaths.tops.films.base(),
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: 'TV Shows',
    subtitle: 'Shows in WIAG database',
    path: routerPaths.tops.shows.base(),
    searchType: SearchType.Show,
  }),
  buildPageRoute({
    title: 'Your Votes',
    path: routerPaths.my.votes(),
    searchType: SearchType.Multi,
    icon: <IconStar className="text-starbright" />,
  }),
];
