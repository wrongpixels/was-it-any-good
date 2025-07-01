import { UserSessionData } from '../../../shared/types/models';
import { removeAxiosToken, setAxiosToken } from './axios-config';

const STORAGE_KEY_USER = 'user-data';

export const saveUserSession = (sessionData: UserSessionData) => {
  setAxiosToken(sessionData.token);
  window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionData));
};

export const eraseUserSession = () => {
  removeAxiosToken();
  window.localStorage.removeItem(STORAGE_KEY_USER);
};

export const tryLoadUserData = (): UserSessionData | null => {
  const stringData: string | null =
    window.localStorage.getItem(STORAGE_KEY_USER);
  if (!stringData) {
    return null;
  }
  const sessionData: UserSessionData = JSON.parse(stringData);
  if (!sessionData) {
    return null;
  }

  if (!sessionData.expired) {
    return {
      ...sessionData,
      createdAt: new Date(sessionData.createdAt),
      updatedAt: new Date(sessionData.updatedAt),
    };
  }
  return null;
};
