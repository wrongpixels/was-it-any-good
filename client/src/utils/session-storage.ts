import { UserSessionData } from '../../../shared/types/models';

const STORAGE_KEY_USER = 'user-data';

export const saveUserSession = (sessionData: UserSessionData) => {
  window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionData));
};

export const eraseUserSession = () => {
  window.localStorage.removeItem(STORAGE_KEY_USER);
};

export const getUserData = (): UserSessionData | null => {
  const stringData: string | null =
    window.localStorage.getItem(STORAGE_KEY_USER);
  if (!stringData) {
    return null;
  }
  const sessionData: UserSessionData = JSON.parse(stringData);
  return {
    ...sessionData,
    createdAt: new Date(sessionData.createdAt),
    updatedAt: new Date(sessionData.updatedAt),
  };
};
