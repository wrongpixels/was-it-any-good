import { useContext } from 'react';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { useLoginMutation } from '../queries/login-queries';
import { saveUserSession } from '../utils/session-storage';
import { AuthContextValues, AuthContext } from '../context/AuthContext';
import { UseMutationResult } from '@tanstack/react-query';

interface OptionValues {
  onSuccess?: (data: UserSessionData) => void;
  onError?: (error: Error) => void;
}

type LoginValues = (data: LoginData, options?: OptionValues) => void;

export interface AuthValues {
  login: LoginValues;
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

  const login = (data: LoginData, options?: OptionValues) =>
    mutation.mutate(data, {
      onSuccess: (sessionData: UserSessionData) => {
        saveUserSession(sessionData);
        setSession(sessionData);
        options?.onSuccess?.(sessionData);
      },
      onError: (error: Error) => {
        options?.onError?.(error);
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
