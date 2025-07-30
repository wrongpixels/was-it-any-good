import { JSX } from 'react';
import UrlQueryBuilder from '../../utils/url-query-builder';
import { routerPaths } from '../../utils/url-helper';
import { MediaType } from '../../../../shared/types/media';
import { OrderBy } from '../../../../shared/types/browse';
import { Link } from 'react-router-dom';
import FilmIcon from '../Header/Search/icons/FilmIcon';
import ShowIcon from '../Header/Search/icons/ShowIcon';
import StarIcon from '../Rating/StarIcon';
import TrendingIcon from '../Header/Search/icons/TrendingIcon';
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
    text: 'Trending',
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
    <span className={'px-3 flex flex-row gap-6 py-1.5 text-sm w-5xl min-w-xl'}>
      {links.map((li: LinkInfo) => (
        <Link
          key={li.key}
          to={li.url}
          className="flex flex-row gap-0.5 items-center text-gray-500"
          title={li.title}
        >
          {li.icon || null}
          <span className={`${styles.hyperlink}`}>{li.text}</span>
        </Link>
      ))}
    </span>
  );
};

export default RankingBar;
