import { JSX } from 'react';
import { routerPaths } from '../../utils/url-helper';
import { Link } from 'react-router-dom';
import FilmIcon from '../common/icons/media/IconFilm';
import ShowIcon from '../common/icons/media/IconShow';
import StarIcon from '../common/icons/rating/IconStar';
import CrownIcon from '../common/icons/badges/IconCrown';
import { styles } from '../../constants/tailwind-styles';
import HomeIcon from '../common/icons/IconHome';

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
    icon: <HomeIcon width={15} />,
    title: 'Home / Search',
    url: routerPaths.home,
  },
  {
    text: 'Popular',
    key: 'rb-popular',
    icon: <StarIcon width={15} />,
    title: 'Popular media',
    url: routerPaths.popular.multi.base(),
  },
  {
    text: 'The Best',
    key: 'rb-best',
    title: 'Films and Shows by rating',
    icon: <CrownIcon width={14} />,
    url: routerPaths.tops.multi.base(),
  },
  {
    text: 'Best Films',
    key: 'rb-best-films',
    title: 'Films by user rating',
    icon: <FilmIcon height={14} />,
    url: routerPaths.tops.films.base(),
  },
  {
    text: 'Best Shows',
    key: 'rb-best-shows',
    title: 'Shows by user rating',
    icon: <ShowIcon height={16} />,
    url: routerPaths.tops.shows.base(),
  },
];
const NavBar = (): JSX.Element => {
  return (
    <nav aria-label="NavBar" className="w-5xl min-w-xl px-3 py-1.5">
      <ul className="flex flex-row items-center gap-1.5 text-sm">
        {links.map((li, i) => (
          <li
            key={li.key}
            className={`flex flex-row items-center gap-2 ${styles.animations.opacity70}`}
          >
            <Link
              to={li.url}
              className="flex flex-row items-center gap-1.5 text-gray-600"
              title={li.title}
            >
              {li.icon ?? null}
              <span className="text-starblue">{li.text}</span>
            </Link>
            {i < links.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-0.5 inline-block h-3 w-px bg-gray-400 align-middle"
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
