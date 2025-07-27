import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { doLogin, doLogout, verifySession } from '../services/login-service';

export const useLoginMutation = () =>
  useMutation<UserSessionData, Error, LoginData>({
    mutationFn: (loginData: LoginData) => doLogin(loginData),
  });

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => doLogout(queryClient),
  });
};
export const useAuthVerifyMutation = () =>
  useMutation<UserSessionData | null, Error, UserSessionData | null>({
    mutationFn: (session: UserSessionData | null) => verifySession(session),
  });
