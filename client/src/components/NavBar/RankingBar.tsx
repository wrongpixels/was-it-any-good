import { JSX } from 'react';
import UrlQueryBuilder from '../../utils/url-query-builder';
import { routerPaths } from '../../utils/url-helper';
import { MediaType } from '../../../../shared/types/media';
import { OrderBy } from '../../../../shared/types/browse';
import { Link } from 'react-router-dom';

interface LinkInfo {
  title: string;
  url: string;
  key: string;
}

const RankingBar = (): JSX.Element => {
  const urlBuilder: UrlQueryBuilder = new UrlQueryBuilder();
  const buildLink = (query: string): string =>
    routerPaths.browse.byQuery(query);

  const popular: LinkInfo = {
    title: 'Trending',
    key: 'rb-trending',
    url: buildLink(urlBuilder.orderBy(OrderBy.Popularity).toString()),
  };
  const bestAll: LinkInfo = {
    title: 'The Best',
    key: 'rb-best',
    url: buildLink(urlBuilder.orderBy(OrderBy.Rating).toString()),
  };
  const bestFilms: LinkInfo = {
    title: 'Best Films',
    key: 'rb-best-films',
    url: buildLink(
      urlBuilder.byMediaType(MediaType.Film).orderBy(OrderBy.Rating).toString()
    ),
  };
  const bestShows: LinkInfo = {
    title: 'Best Shows',
    key: 'rb-best-shows',
    url: buildLink(
      urlBuilder.byMediaType(MediaType.Show).orderBy(OrderBy.Rating).toString()
    ),
  };
  const links: LinkInfo[] = [popular, bestAll, bestFilms, bestShows];
  console.log(popular);
  return (
    <span className={'flex flex-row gap-5 py-1.5 text-sm'}>
      {links.map((li: LinkInfo) => (
        <Link key={li.key} to={li.url}>
          {li.title}
        </Link>
      ))}
    </span>
  );
};

export default RankingBar;
