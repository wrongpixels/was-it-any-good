import { Session } from '../models';

export const isValidSession = (session: Session): boolean => {
  if (session.isExpired() || !session.user) {
    return false;
  }
  return true;
};
