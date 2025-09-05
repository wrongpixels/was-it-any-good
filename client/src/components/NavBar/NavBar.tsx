import { JSX } from 'react';
import { routerPaths } from '../../utils/url-helper';
import { NavLink } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';
import IconCrown from '../Common/Icons/Badges/IconCrown';
import IconHome from '../Common/Icons/IconHome';
import IconFilm from '../Common/Icons/Media/IconFilm';
import IconShow from '../Common/Icons/Media/IconShow';
import IconStar from '../Common/Icons/Ratings/IconStar';

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
    url: routerPaths.home,
  },
  {
    text: 'Popular',
    key: 'rb-popular',
    icon: <IconStar width={15} />,
    title: 'Popular media',
    url: routerPaths.popular.multi.base(),
  },
  {
    text: 'The Best',
    key: 'rb-best',
    title: 'Films and Shows by rating',
    icon: <IconCrown width={14} />,
    url: routerPaths.tops.multi.base(),
  },
  {
    text: 'Films',
    key: 'rb-films',
    title: 'Films by user rating',
    icon: <IconFilm height={14} />,
    url: routerPaths.tops.films.base(),
  },
  {
    text: 'TV Shows',
    key: 'rb-shows',
    title: 'Shows by user rating',
    icon: <IconShow height={16} />,
    url: routerPaths.tops.shows.base(),
  },
];

const NavBar = (): JSX.Element => {
  return (
    <nav aria-label="NavBar" className="w-5xl min-w-xl py-1 px-3">
      <ul className="flex flex-row items-center text-sm">
        {links.map((li, i) => (
          <li
            key={li.key}
            className={`flex flex-row items-center ${styles.animations.opacity70}`}
          >
            <NavLink
              to={li.url}
              title={li.title}
              className={({ isActive }) =>
                `flex flex-row items-center gap-1.5 py-0.5 px-1.5 text-gray-600 border-b-2 rounded ${
                  isActive
                    ? 'border-amber-400/70 bg-gradient-to-t from-amber-200/35 to-transparent via-amber-200/10'
                    : 'border-transparent'
                }`
              }
              end={li.url === routerPaths.home}
            >
              {li.icon ?? null}
              <span className="text-starblue">{li.text}</span>
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
    </nav>
  );
};

export default NavBar;
