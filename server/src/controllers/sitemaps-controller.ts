import { NextFunction, Request, Response, Router } from 'express';
import express from 'express';

import { Film, Show } from '../models';
import { buildMediaXMLSitemap, formatDate } from '../services/sitemaps-service';
import { BASE_URL } from '../../../shared/constants/url-constants';
import { clientPaths } from '../../../shared/util/url-builder';

const router: Router = express.Router();

//endpoint for out static pages.
//we simply set lastmod to today in our template and return it
router.get(
  '/static.xml',
  (_req: Request, res: Response, _next: NextFunction) => {
    const today = formatDate(new Date());

    const staticPages = [
      { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
      {
        loc: `${BASE_URL}${clientPaths.films.page}`,
        changefreq: 'daily',
        priority: '0.8',
      },
      {
        loc: `${BASE_URL}${clientPaths.shows.page}`,
        changefreq: 'daily',
        priority: '0.8',
      },
      {
        loc: `${BASE_URL}${clientPaths.tops.multi.base()}`,
        changefreq: 'daily',
        priority: '0.9',
      },
      {
        loc: `${BASE_URL}${clientPaths.tops.films.base()}`,
        changefreq: 'daily',
        priority: '0.9',
      },
      {
        loc: `${BASE_URL}${clientPaths.tops.shows.base()}`,
        changefreq: 'daily',
        priority: '0.9',
      },
      {
        loc: `${BASE_URL}${clientPaths.browse.base}`,
        changefreq: 'weekly',
        priority: '0.7',
      },
      {
        loc: `${BASE_URL}${clientPaths.search.base}`,
        changefreq: 'weekly',
        priority: '0.7',
      },
    ];

    const urlEntries = staticPages
      .map(
        (page) => `
    <url>
        <loc>${page.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`
      )
      .join('');

    const sitemapXml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`;

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemapXml);
  }
);

router.get(
  '/films.xml',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const films: Film[] = await Film.findAll({
        attributes: ['id', 'name', 'updatedAt', 'mediaType'],
        order: [['updatedAt', 'DESC']],
      });
      const sitemapXml: string = buildMediaXMLSitemap(films);
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.setHeader('Content-Type', 'application/xml');

      res.status(200).send(sitemapXml);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/shows.xml',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const films: Show[] = await Show.findAll({
        attributes: ['id', 'name', 'updatedAt', 'mediaType'],
        order: [['updatedAt', 'DESC']],
      });
      const sitemapXml: string = buildMediaXMLSitemap(films);
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.setHeader('Content-Type', 'application/xml');

      res.status(200).send(sitemapXml);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
