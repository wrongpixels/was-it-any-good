import { UserSessionData } from '../../../shared/types/models';
import { removeAxiosToken, setAxiosToken } from './axios-config';
import { STORAGE_KEY_USER } from '../constants/session-constants';
import { QueryClient } from '@tanstack/react-query';

export const saveLocalUserSession = (sessionData: UserSessionData) => {
  console.log('save was called?');
  setAxiosToken(sessionData.token);
  window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionData));
};

export const logoutClientSide = (queryClient: QueryClient) => {
  console.log('ok,logging out now');

  eraseLocalUserSession();
  queryClient.removeQueries();
};

export const eraseLocalUserSession = () => {
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
