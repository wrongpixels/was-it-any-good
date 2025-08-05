import { JSX } from 'react';
import { routerPaths } from '../../utils/url-helper';
import { Link } from 'react-router-dom';
import FilmIcon from '../common/icons/FilmIcon';
import ShowIcon from '../common/icons/ShowIcon';
import StarIcon from '../common/icons/Rating/StarIcon';
import { styles } from '../../constants/tailwind-styles';
import CrownIcon from '../common/icons/Crown';

interface LinkInfo {
  text: string;
  url: string;
  key: string;
  title?: string;
  icon?: JSX.Element;
}

const RankingBar = (): JSX.Element => {
  const popular: LinkInfo = {
    text: 'Popular',
    key: 'rb-popular',
    icon: <StarIcon width={15} />,
    title: 'Popular media',
    url: routerPaths.popular.multi.base(),
  };
  const bestAll: LinkInfo = {
    text: 'The Best',
    key: 'rb-best',
    title: 'Films and Shows by rating',
    icon: <CrownIcon width={14} />,
    url: routerPaths.tops.multi.base(),
  };
  const bestFilms: LinkInfo = {
    text: 'Best Films',
    key: 'rb-best-films',
    title: 'Films by user rating',
    icon: <FilmIcon height={14} />,
    url: routerPaths.tops.films.base(),
  };
  const bestShows: LinkInfo = {
    text: 'Best Shows',
    key: 'rb-best-shows',
    title: 'Shows by user rating',
    icon: <ShowIcon height={16} />,
    url: routerPaths.tops.shows.base(),
  };
  const links: LinkInfo[] = [popular, bestFilms, bestShows, bestAll];
  console.log(popular);
  return (
    <span
      className={'px-3 flex flex-row gap-1.5 py-1.5 text-sm w-5xl min-w-xl'}
    >
      {links.map((li: LinkInfo, i: number) => (
        <span
          key={li.key}
          className={`flex flex-row gap-2 items-center ${styles.animations.opacity70}`}
        >
          <Link
            to={li.url}
            className="flex flex-row gap-1.5 items-center text-gray-600"
            title={li.title}
          >
            {li.icon || null}
            <span className={`text-starblue`}>{li.text}</span>
          </Link>
          {i < links.length - 1 && (
            <span className="text-xs text-gray-500 mb-0.5">{'|'}</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default RankingBar;
