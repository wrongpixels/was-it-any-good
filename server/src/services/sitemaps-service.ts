import { BASE_URL } from '../../../shared/constants/url-constants';
import { joinUrl } from '../../../shared/helpers/format-helper';
import { MediaResponse, PersonResponse } from '../../../shared/types/models';
import {
  buildMediaLinkWithSlug,
  buildPersonLinkWithSlug,
} from '../../../shared/util/url-builder';

//to build a single sitemap entry for a piece of media with its correct link.
//works with any kind of media
export const buildMediaXMLSitemap = (media: MediaResponse[]): string => {
  const urlEntries = media
    .map((m: MediaResponse) => {
      const fullUrl: string = joinUrl(BASE_URL, buildMediaLinkWithSlug(m));
      const lastmod: string = formatDate(m.updatedAt);

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

export const buildPeopleSitemap = (people: PersonResponse[]): string => {
  const urlEntries = people
    .map((p: PersonResponse) => {
      const fullUrl: string = joinUrl(BASE_URL, buildPersonLinkWithSlug(p));
      const lastmod: string = formatDate(p.updatedAt);

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

export const formatDate = (date?: Date | string | undefined): string => {
  //in case something is missing or fails
  const today: string = new Date().toISOString().split('T')[0];

  if (!date) {
    return today;
  }

  const receivedDate: Date = new Date(date);

  if (isNaN(receivedDate.getTime())) {
    return today;
  }
  return receivedDate.toISOString().split('T')[0];
};
