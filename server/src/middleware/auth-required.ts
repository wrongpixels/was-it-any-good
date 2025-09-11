//a middleware that verifies the user is logged.
//used in endpoints that require a valid auth to access them.
//session + token validation is already done in every api call, this just
//throws an error if no valid session was found.

import { Request } from 'express';
import { AuthError } from '../util/customError';

export const authRequired = (req: Request) => {
  if (!req.activeUser?.isValid) {
    throw new AuthError();
  }
};
