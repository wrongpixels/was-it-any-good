import { LoginData, UserSessionData } from '../../../shared/types/models';
import axios, { AxiosResponse } from 'axios';
import { apiPaths } from '../utils/url-helper';

export const doLogin = async (
  loginData: LoginData
): Promise<UserSessionData> => {
  const { data }: AxiosResponse<UserSessionData> = await axios.post(
    apiPaths.auth.login(),
    loginData
  );
  return data;
};

export const doLogout = async (): Promise<AxiosResponse> => {
  return await axios.post(apiPaths.auth.logout());
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
