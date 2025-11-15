import { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';
import IconCrown from '../Common/Icons/Badges/IconCrown';
import IconHome from '../Common/Icons/IconHome';
import IconFilm from '../Common/Icons/Media/IconFilm';
import IconShow from '../Common/Icons/Media/IconShow';
import IconStar from '../Common/Icons/Ratings/IconStar';
import { useAuth } from '../../hooks/use-auth';
import IconWatchlistRemove from '../Common/Icons/Lists/IconWatchlistRemove';
import { USER_LISTS_ENABLED } from '../UserLists/UserLists';
import { clientPaths } from '../../../../shared/util/url-builder';

const SHOW_WATCHLIST: boolean = false;

interface LinkInfo {
  text: string;
  url: string;
  key: string;
  title?: string;
  icon?: JSX.Element;
}

const links: LinkInfo[] = [
  {
    text: 'Home',
    key: 'rb-home',
    icon: <IconHome width={15} />,
    title: 'Home / Search',
    url: clientPaths.home,
  } /*
  {
    text: 'Popular',
    key: 'rb-popular',
    icon: <IconStar width={15} />,
    title: 'Popular media',
    url: routerPaths.popular.multi.base(),
  },*/,
  {
    text: 'The Best',
    key: 'rb-best',
    title: 'Films and Shows by rating',
    icon: <IconCrown width={14} />,
    url: clientPaths.tops.multi.base(),
  },
  {
    text: 'Films',
    key: 'rb-films',
    title: 'Browse Films',
    icon: <IconFilm height={14} />,
    url: clientPaths.films.page,
  },
  {
    text: 'TV Shows',
    key: 'rb-shows',
    title: 'Browse TV Shows',
    icon: <IconShow height={16} />,
    url: clientPaths.shows.page,
  },
];

const NavBar = (): JSX.Element => {
  let activeTab: boolean = false;
  const auth = useAuth();
  return (
    <nav
      aria-label="NavBar"
      className={`${styles.contentWidth} my-1 flex flex-row w-full`}
    >
      <ul className="flex flex-row items-center text-xs md:text-sm">
        {links.map((li, i) => (
          <li
            key={li.key}
            className={`flex flex-row items-center  ${styles.animations.opacity70}`}
          >
            <NavLink
              to={li.url}
              title={li.title}
              className={({ isActive }) => {
                activeTab = isActive;
                return `flex flex-row items-center gap-1.5 py-0.5 px-1.5 text-gray-600 border-b-2 rounded ${
                  activeTab
                    ? 'border-amber-400/70 bg-gradient-to-t from-amber-200/30 to-transparent via-amber-200/10'
                    : 'border-transparent'
                }`;
              }}
              end={li.url === clientPaths.home}
            >
              {li.icon ?? null}
              <span className="text-starblue hidden sm:block">{li.text}</span>
            </NavLink>
            {i < links.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-0.5 inline-block h-3 w-px bg-gray-325 align-middle"
              />
            )}
          </li>
        ))}
      </ul>
      {auth.session && (
        <div className="ml-auto text-end text-xs md:text-sm h-full items-center  flex flex-row">
          <span className={`${styles.animations.opacity70}`}>
            <NavLink
              to={clientPaths.my.votes.base()}
              title={'My Ratings'}
              className={({ isActive }) =>
                `flex flex-row items-center gap-1.5 py-0.5 px-1.5 text-gray-600 border-b-2 rounded ${
                  isActive
                    ? 'border-amber-400/70 bg-gradient-to-t from-amber-200/30 to-transparent via-amber-200/10'
                    : 'border-transparent'
                }`
              }
              end={clientPaths.my.votes.base() === clientPaths.my.votes.base()}
            >
              {<IconStar width={16} />}
              <span className="text-starblue">{'My Ratings'}</span>
            </NavLink>
          </span>
          {USER_LISTS_ENABLED && SHOW_WATCHLIST && (
            <span className={`${styles.animations.opacity70}`}>
              <NavLink
                to={clientPaths.my.watchlist.base()}
                title={'Watchlist'}
                className={({ isActive }) =>
                  `flex flex-row items-center gap-1 py-0.5 px-1.5 text-gray-600 border-b-2 rounded ${
                    isActive
                      ? 'border-amber-400/70 bg-gradient-to-t from-amber-200/30 to-transparent via-amber-200/10'
                      : 'border-transparent'
                  }`
                }
                end={
                  clientPaths.my.watchlist.base() ===
                  clientPaths.my.watchlist.base()
                }
              >
                {<IconWatchlistRemove height={16} width={14} />}
                <span className="text-starblue">{'Watchlist'}</span>
              </NavLink>
            </span>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
