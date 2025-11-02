import { BASE_URL } from '../../../shared/constants/url-constants';
import { slugifyUrl } from '../../../shared/helpers/format-helper';
import { MediaResponse } from '../../../shared/types/models';
import film from '../models/media/film';

export const buildMediaXMLSitemap = (media: MediaResponse[]): string => {
  const urlEntries = media
    .map((m: MediaResponse) => {
      const fullUrl: string = slugifyUrl(`${BASE_URL}/film/${m.id}`, film.name);
      const lastmod: string = m.updatedAt
        ? new Date(m.updatedAt).toISOString().split('T')[0]
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
  return sitemapXml;
};
