//a middleware that checks the received slug, compares it with the expected one,
//and then redirects to the correct one if wrong/missing

//THIS MIDDLEWARE ONLY WORKS FOR ROUTES OF FORMAT /:id/:slug !!

//this middleware runs after id-format-checker, so we know 'id' is present
//and correctly formatted.

import { RequestHandler, NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../util/customError';
import { findByPkInModel } from '../util/model-helpers';
import { Film, Person, Show } from '../models';
import { slugifyText } from '../../../shared/helpers/format-helper';

export const slugHandler = (
  model: typeof Film | typeof Show | typeof Person
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    //we quickly look for the target entry and only check the name.
    const entry = await findByPkInModel(model, id, { attributes: ['name'] });
    if (!entry) {
      throw new NotFoundError(model.name);
    }
    //all accepted models have a name, so we can access it with no issues.
    const entryName: string = entry.name;
    const expectedSlug: string = slugifyText(entryName);
    req.activeSlug = expectedSlug;
    next();
    /*
    //if no slug or if the expected one doesn't match the provided one, we redirect.
    if (!slug || expectedSlug !== slug) {
      const newPath: string = `http${process.env.HOST ? 's' : ''}://${process.env.HOST ?? 'localhost:5173'}/${model.name}/${id}/${expectedSlug}`;
      console.log('Wrong or missing slug found:', req.url);
      console.log('Redirecting to:', newPath);
      return res.redirect(301, newPath);
    } else {
      console.log('Correct slug');
      next();
    } */
  };
};
