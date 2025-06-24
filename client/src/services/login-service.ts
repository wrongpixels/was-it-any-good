import { LoginData, UserSessionData } from '../../../shared/types/models';
import axios, { AxiosResponse } from 'axios';

export const doLogin = async (
  loginData: LoginData
): Promise<UserSessionData> => {
  const session: AxiosResponse<UserSessionData> = await axios.post(
    '/api/login',
    loginData
  );
  return session.data;
};
