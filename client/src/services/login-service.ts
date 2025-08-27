import { LoginData, UserSessionData } from '../../../shared/types/models';
import axios, { AxiosResponse } from 'axios';
import { apiPaths } from '../utils/url-helper';
import { QueryClient } from '@tanstack/react-query';
import { logoutClientSide } from '../utils/session-handler';

export const doLogin = async (
  loginData: LoginData
): Promise<UserSessionData> => {
  console.log(loginData);
  const { data }: AxiosResponse<UserSessionData> = await axios.post(
    apiPaths.auth.login(),
    loginData
  );
  return data;
};

//for logging out consistently, we remove the token before waiting for the api,
//however, we still need to send a token so the active user can be identified.
//we store the token, then logout the frontend, and manually attach it with the request
export const doLogout = async (
  queryClient: QueryClient
): Promise<AxiosResponse> => {
  const token = axios.defaults.headers.common['Authorization'];
  logoutClientSide(queryClient);
  return await axios.post(apiPaths.auth.logout(), null, {
    headers: {
      Authorization: token,
    },
  });
};

export const verifySession = async (
  session: UserSessionData | null
): Promise<UserSessionData | null> => {
  if (!session) {
    return Promise.resolve(null);
  }
  const { data }: AxiosResponse<UserSessionData> = await axios.post(
    apiPaths.auth.sessions.verify(),
    session
  );
  return data;
};
