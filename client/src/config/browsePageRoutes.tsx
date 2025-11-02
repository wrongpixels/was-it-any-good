import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { JSX } from 'react';
import {
  SortBy,
  sortByUserValues,
  sortByUserWatchlistValues,
  SortDir,
} from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OptIconProps } from '../types/common-props-types';
import IconCrown from '../components/Common/Icons/Badges/IconCrown';
import IconFilm from '../components/Common/Icons/Media/IconFilm';
import IconShow from '../components/Common/Icons/Media/IconShow';
import IconStar from '../components/Common/Icons/Ratings/IconStar';
import { QueryToUse } from '../types/search-browse-types';
import { OverrideSortOptions } from '../components/Search/Results/PageResultsSort';
import IconWatchlistAdd from '../components/Common/Icons/Lists/IconWatchlistAdd';
import { clientPaths } from '../../../shared/util/url-builder';
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
  queryToUse?: QueryToUse;
  overrideSortOptions?: OverrideSortOptions;
}

const buildPageRoute = ({
  title,
  path,
  subtitle,
  icon,
  queryToUse,
  overrideSortOptions,
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
      overrideSortOptions,
      overrideParams: {
        sortBy: sortBy === SortBy.Rating ? undefined : sortBy,
        searchType,
        basePath: path,
      },
      queryToUse,
    },
  };
};
//creates a series of Browse routes directly within App.tsx with
//options for different titles, icons and even queries
//example: top/shows, popular/media or my/votes
export const browsePageRoutes: BrowsePageRouterData[] = [
  buildPageRoute({
    title: 'Popular Media',
    subtitle: 'Most popular media in WIAG database',
    path: clientPaths.popular.multi.base(),
    sortBy: SortBy.Popularity,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: 'Top Rated Media',
    subtitle: 'Highest rated media in WIAG database',
    path: clientPaths.tops.multi.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: 'Films',
    subtitle: 'Films in WIAG database',
    path: clientPaths.films.page,
    sortBy: SortBy.Rating,
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: 'TV Shows',
    subtitle: 'Shows in WIAG database',
    path: clientPaths.shows.page,
    sortBy: SortBy.Rating,
    searchType: SearchType.Show,
  }),
  buildPageRoute({
    title: 'Top Films',
    subtitle: 'Best Films in WIAG database',
    path: clientPaths.tops.films.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Film,
    overrideSortOptions: {
      overrideOptions: [SortBy.Rating],
    },
  }),
  buildPageRoute({
    title: 'Top TV Shows',
    subtitle: 'Best Shows in WIAG database',
    path: clientPaths.tops.shows.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Show,
    overrideSortOptions: {
      overrideOptions: [SortBy.Rating],
    },
  }),
  buildPageRoute({
    title: 'My Ratings',
    queryToUse: 'votes',
    path: clientPaths.my.votes.base(),
    searchType: SearchType.Multi,
    icon: <IconStar {...defIconProps} />,
    sortBy: SortBy.VoteDate,
    overrideSortOptions: {
      overrideOptions: sortByUserValues,
    },
  }),
  buildPageRoute({
    title: 'Watchlist',
    path: clientPaths.my.watchlist.base(),
    searchType: SearchType.Multi,
    icon: <IconWatchlistAdd {...defIconProps} />,
    sortBy: SortBy.AddedDate,
    overrideSortOptions: {
      overrideOptions: sortByUserWatchlistValues,
    },
  }),
];
