import { useContext } from 'react';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { useLoginMutation } from '../mutations/login-mutations';
import { eraseUserSession, saveUserSession } from '../utils/session-storage';
import { UseAuthContextValues, AuthContext } from '../context/Auth';
import { UseMutationResult } from '@tanstack/react-query';

interface OptionValues {
  onSuccess?: (data: UserSessionData) => void;
  onError?: (error: Error) => void;
}

type LoginValues = (data: LoginData, options?: OptionValues) => void;

export interface AuthValues {
  login: LoginValues;
  logout: () => void;
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
  const { session, setSession }: UseAuthContextValues = useContext(AuthContext);

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

  const logout = () => {
    setSession(null);
    eraseUserSession();
  };

  return {
    login,
    logout,
    session,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
  };
};
