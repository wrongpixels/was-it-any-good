import { useContext } from 'react';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { useLoginMutation } from '../queries/login-queries';
import { saveUserSession } from '../utils/session-storage';
import { AuthContextValues, AuthContext } from '../context/AuthContext';
import { UseMutationResult } from '@tanstack/react-query';

export interface AuthValues {
  login: (data: LoginData) => void;
  isSuccess: boolean;
  isError: boolean;
  isPending: boolean;
  session: UserSessionData | null;
}

export const useAuth = (): AuthValues => {
  const mutation: UseMutationResult<
    UserSessionData,
    Error,
    LoginData,
    unknown
  > = useLoginMutation();
  const { session, setSession }: AuthContextValues = useContext(AuthContext);
  const login = (loginData: LoginData) =>
    mutation.mutate(loginData, {
      onSuccess: (sessionData: UserSessionData) => {
        saveUserSession(sessionData);
        setSession(sessionData);
      },
    });

  return {
    login,
    session,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
  };
};
