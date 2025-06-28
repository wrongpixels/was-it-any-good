import { ActiveUser, UserSessionData } from '../../../shared/types/models';
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

export const isAuthorizedUser = (
  user: ActiveUser | undefined,
  validId: number
): boolean => {
  if (!user || !user.isValid) {
    return false;
  }
  if (user.id === validId || user.isAdmin) {
    return true;
  }
  return false;
};
