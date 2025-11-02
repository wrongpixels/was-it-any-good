//just for the base sitemap, it lives outside api so it can be on the root.

import { NextFunction, Request, Response, Router } from 'express';
import express from 'express';

import { Film, Person, Show } from '../models';
import { formatDate } from '../services/sitemaps-service';
import { BASE_URL } from '../../../shared/constants/url-constants';
//a router for root level files we want to server from the backend.
//THE URL OF EACH FILE HAS TO BE ADDED TO VITE PROXY IF WE WANT TO RECEIVE
//THE REQUESTS IN DEVELOPMENT!

const router: Router = express.Router();

//our robots.txt file
router.get('/robots.txt', (_req: Request, res: Response) => {
  const robotsTxtContent = `User-agent: *

Sitemap: ${BASE_URL}/sitemap.xml
`;

  // Set the correct content type and send the response
  res.type('text/plain');
  res.status(200).send(robotsTxtContent);
});

//we generate the index of out sitemap live with current 'lastmod' so we don't
//need to keep updatng them
router.get(
  '/sitemap.xml',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      //we take the latest updateAt of out Films and Shows
      const lastFilmUpdate: Date = await Film.max<Date, Film>('updatedAt');
      const lastShowUpdate: Date = await Show.max<Date, Show>('updatedAt');
      const lastPeopleUpdate: Date = await Person.max<Date, Person>(
        'updatedAt'
      );

      //this will return today's date formatted
      const lastmodForStatic: string = formatDate();

      const lastmodForFilms: string = formatDate(lastFilmUpdate);
      const lastmodForShows: string = formatDate(lastShowUpdate);
      const lastmodForPeople: string = formatDate(lastPeopleUpdate);

      //and we build the index for static, films and shows with accurate lastmods
      //pointing to the correct endpoint for each
      const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <sitemap>
      <loc>${BASE_URL}/api/sitemaps/static.xml</loc>
      <lastmod>${lastmodForStatic}</lastmod>
   </sitemap>
   <sitemap>
      <loc>${BASE_URL}/api/sitemaps/films.xml</loc>
      <lastmod>${lastmodForFilms}</lastmod> 
   </sitemap>
   <sitemap>
      <loc>${BASE_URL}/api/sitemaps/shows.xml</loc>
      <lastmod>${lastmodForShows}</lastmod>
   </sitemap>
   <sitemap>
      <loc>${BASE_URL}/api/sitemaps/people.xml</loc>
      <lastmod>${lastmodForPeople}</lastmod>
   </sitemap>
</sitemapindex>`;
      //we return this as a formatted xml file
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemapIndexXml);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
