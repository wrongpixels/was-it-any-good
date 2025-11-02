import { NextFunction, Request, Response, Router } from 'express';
import express from 'express';

import { slugifyUrl } from '../../../shared/helpers/format-helper';
import { Film } from '../models';
import { BASE_URL } from '../../../shared/constants/url-constants';

const router: Router = express.Router();

router.get(
  '/films',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const films: Film[] = await Film.findAll({
        attributes: ['id', 'name', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
      });

      const urlEntries = films
        .map((film) => {
          const fullUrl: string = slugifyUrl(
            `${BASE_URL}/film/${film.id}`,
            film.name
          );
          const lastmod: string = film.updatedAt
            ? new Date(film.updatedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

          return `
          <url>
            <loc>${fullUrl}</loc>
            <lastmod>${lastmod}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
        })
        .join('');

      const sitemapXml: string = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`;

      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.setHeader('Content-Type', 'application/xml');

      res.status(200).send(sitemapXml);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
