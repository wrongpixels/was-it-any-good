import { JSX } from 'react';
import UrlQueryBuilder from '../../utils/url-query-builder';
import { routerPaths } from '../../utils/url-helper';
import { MediaType } from '../../../../shared/types/media';
import { OrderBy } from '../../../../shared/types/browse';
import { Link } from 'react-router-dom';
import FilmIcon from '../common/icons/FilmIcon';
import ShowIcon from '../common/icons/ShowIcon';
import StarIcon from '../common/icons/Rating/StarIcon';
import TrendingIcon from '../common/icons/TrendingIcon';
import { styles } from '../../constants/tailwind-styles';

interface LinkInfo {
  text: string;
  url: string;
  key: string;
  title?: string;
  icon?: JSX.Element;
}

const RankingBar = (): JSX.Element => {
  const urlBuilder: UrlQueryBuilder = new UrlQueryBuilder();
  const buildLink = (query: string): string =>
    routerPaths.browse.byQuery(query);

  const popular: LinkInfo = {
    text: 'Popular',
    key: 'rb-trending',
    icon: <TrendingIcon height={14} />,
    title: 'Popular media',
    url: buildLink(urlBuilder.orderBy(OrderBy.Popularity).toString()),
  };
  const bestAll: LinkInfo = {
    text: 'The Best',
    key: 'rb-best',
    title: 'Films and Shows by rating',
    icon: <StarIcon width={15} />,
    url: buildLink(urlBuilder.orderBy(OrderBy.Rating).toString()),
  };
  const bestFilms: LinkInfo = {
    text: 'Best Films',
    key: 'rb-best-films',
    title: 'Films by user rating',
    icon: <FilmIcon height={14} />,
    url: buildLink(
      urlBuilder.byMediaType(MediaType.Film).orderBy(OrderBy.Rating).toString()
    ),
  };
  const bestShows: LinkInfo = {
    text: 'Best Shows',
    key: 'rb-best-shows',
    title: 'Shows by user rating',
    icon: <ShowIcon height={16} />,
    url: buildLink(
      urlBuilder.byMediaType(MediaType.Show).orderBy(OrderBy.Rating).toString()
    ),
  };
  const links: LinkInfo[] = [popular, bestAll, bestFilms, bestShows];
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
