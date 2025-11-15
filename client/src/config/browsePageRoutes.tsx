import { BrowsePageProps } from '../components/Search/Browse/BrowsePage';
import { JSX } from 'react';
import {
  SortBy,
  sortByUserValues,
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

import { apiPaths, clientPaths } from '../../../shared/util/url-builder';
import { BasePageRoutes } from '../constants/search-browse-constants';
import IconWatchlistRemove from '../components/Common/Icons/Lists/IconWatchlistRemove';
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
  //to set a route as auth protected
  authReq?: boolean;
  //to set a specific api path to call with the mutation
  apiPath?: string;
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
  authReq,
  apiPath,
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
      apiPath,
      authReq,
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
    title: BasePageRoutes.PopularMedia,
    subtitle: 'Most popular media in WIAG database',
    path: clientPaths.popular.multi.base(),
    sortBy: SortBy.Popularity,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: BasePageRoutes.TopMedia,
    subtitle: 'Highest rated media in WIAG database',
    path: clientPaths.tops.multi.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Multi,
  }),
  buildPageRoute({
    title: BasePageRoutes.Films,
    subtitle: 'Films in WIAG database',
    path: clientPaths.films.page,
    sortBy: SortBy.Rating,
    searchType: SearchType.Film,
  }),
  buildPageRoute({
    title: BasePageRoutes.Shows,
    subtitle: 'Shows in WIAG database',
    path: clientPaths.shows.page,
    sortBy: SortBy.Rating,
    searchType: SearchType.Show,
  }),
  buildPageRoute({
    title: BasePageRoutes.TopFilms,
    subtitle: 'Best Films in WIAG database',
    path: clientPaths.tops.films.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Film,
    overrideSortOptions: {
      overrideOptions: [SortBy.Rating],
    },
  }),
  buildPageRoute({
    title: BasePageRoutes.TopShows,
    subtitle: 'Best Shows in WIAG database',
    path: clientPaths.tops.shows.base(),
    sortBy: SortBy.Rating,
    searchType: SearchType.Show,
    overrideSortOptions: {
      overrideOptions: [SortBy.Rating],
    },
  }),
  buildPageRoute({
    title: BasePageRoutes.MyVotes,
    queryToUse: 'votes',
    authReq: true,
    path: clientPaths.my.votes.base(),
    searchType: SearchType.Multi,
    icon: <IconStar {...defIconProps} />,
    sortBy: SortBy.VoteDate,
    overrideSortOptions: {
      overrideOptions: sortByUserValues,
    },
  }),

  buildPageRoute({
    title: BasePageRoutes.Watchlist,
    path: clientPaths.my.watchlist.base(),
    authReq: true,
    apiPath: apiPaths.watchlist.my(),
    searchType: SearchType.Multi,
    icon: <IconWatchlistRemove {...defIconProps} />,
    sortBy: SortBy.AddedDate,
    overrideSortOptions: {
      //very basic implementation for now, we just allow sorting by date
      //and we lock the invert button
      overrideOptions: [[SortBy.AddedDate, 'Date added']],
      canInvert: false,
    },
  }),
];
