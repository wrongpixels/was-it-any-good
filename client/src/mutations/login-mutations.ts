import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { doLogin, doLogout, verifySession } from '../services/login-service';
import { AxiosResponse } from 'axios';

export const useLoginMutation = () =>
  useMutation<UserSessionData, Error, LoginData>({
    mutationFn: (loginData: LoginData) => doLogin(loginData),
  });

export const useLogoutMutation = (): UseMutationResult<
  AxiosResponse,
  Error,
  void
> => {
  return useMutation({
    mutationFn: doLogout,
  });
};
export const useAuthVerifyMutation = () =>
  useMutation<UserSessionData | null, Error, UserSessionData | null>({
    mutationFn: (session: UserSessionData | null) => verifySession(session),
  });
