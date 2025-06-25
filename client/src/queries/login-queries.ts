import { useMutation } from '@tanstack/react-query';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { doLogin, verifySession } from '../services/login-service';

export const useLoginMutation = () =>
  useMutation<UserSessionData, Error, LoginData>({
    mutationFn: (loginData: LoginData) => doLogin(loginData),
  });

export const useAuthVerifyMutation = () =>
  useMutation<UserSessionData, Error, UserSessionData>({
    mutationFn: (session: UserSessionData) => verifySession(session),
  });
