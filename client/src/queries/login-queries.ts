import { useMutation } from '@tanstack/react-query';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { doLogin } from '../services/login-service';

export const useLoginMutation = () =>
  useMutation<UserSessionData, Error, LoginData>({
    mutationFn: (loginData: LoginData) => doLogin(loginData),
  });
