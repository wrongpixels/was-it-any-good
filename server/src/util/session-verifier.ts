import { UserSessionData } from '../../../shared/types/models';
import { Session } from '../models';

export const isValidSession = (
  localSession: UserSessionData,
  dbSession: Session
): boolean => {
  if (dbSession.isExpired() || !dbSession.user?.isActive) {
    return false;
  }
  if (
    localSession.token !== dbSession.token ||
    localSession.userId !== dbSession.userId
  ) {
    return false;
  }
  return true;
};
