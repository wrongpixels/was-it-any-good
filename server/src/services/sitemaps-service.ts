import { BASE_URL } from '../../../shared/constants/url-constants';
import { joinUrl } from '../../../shared/helpers/format-helper';
import { MediaResponse } from '../../../shared/types/models';
import { buildMediaLinkWithSlug } from '../../../shared/util/url-builder';

//to build a single sitemap entry for a piece of media with its correct link.
//works with any kind of media
export const buildMediaXMLSitemap = (media: MediaResponse[]): string => {
  const urlEntries = media
    .map((m: MediaResponse) => {
      const fullUrl: string = joinUrl(BASE_URL, buildMediaLinkWithSlug(m));
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
