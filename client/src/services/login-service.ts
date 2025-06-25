import { LoginData, UserSessionData } from '../../../shared/types/models';
import axios, { AxiosResponse } from 'axios';

export const doLogin = async (
  loginData: LoginData
): Promise<UserSessionData> => {
  const { data }: AxiosResponse<UserSessionData> = await axios.post(
    '/api/login',
    loginData
  );
  return data;
};

export const verifySession = async (
  session: UserSessionData
): Promise<UserSessionData> => {
  const { data }: AxiosResponse<UserSessionData> = await axios.get(
    `/api/session/validate/${session.id}`
  );
  return data;
};
