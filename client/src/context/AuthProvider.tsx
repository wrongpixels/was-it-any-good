import { createContext, JSX, useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { UserSessionData, LoginData } from '../../../shared/types/models';
import {
  tryLoadUserData,
  saveUserSession,
  logoutClientSide,
} from '../utils/session-handler';
import { setAxiosToken } from '../utils/axios-config';
import {
  useLoginMutation,
  useLogoutMutation,
} from '../mutations/login-mutations';
import { SESSION_QUERY_KEY } from '../constants/session-constants';
import { AxiosResponse } from 'axios';

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextValues {
  session: UserSessionData | null;
  login: (
    data: LoginData,
    options?: {
      onSuccess?: (data: UserSessionData) => void;
      onError?: (error: Error) => void;
    }
  ) => void;
  logout: () => void;
  isLoginPending: boolean;
  isLoadingSession: boolean;
}

export const AuthContext = createContext<AuthContextValues | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => tryLoadUserData(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const loginMutation: UseMutationResult<UserSessionData, Error, LoginData> =
    useLoginMutation();
  const logoutMutation: UseMutationResult<AxiosResponse, Error, void> =
    useLogoutMutation();

  const login = (
    data: LoginData,
    options?: {
      onSuccess?: (data: UserSessionData) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    loginMutation.mutate(data, {
      onSuccess: (newSession: UserSessionData) => {
        saveUserSession(newSession);
        queryClient.setQueryData(SESSION_QUERY_KEY, newSession);
        options?.onSuccess?.(newSession);
      },
      onError: (error: Error) => {
        options?.onError?.(error);
      },
    });
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => logoutClientSide(queryClient),
    });
  };

  useEffect(() => {
    setAxiosToken(session?.token || null);
  }, [session]);

  const value: AuthContextValues = {
    session: session || null,
    login,
    logout,
    isLoginPending: loginMutation.isPending,
    isLoadingSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
