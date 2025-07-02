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
import { verifySession } from '../services/login-service';

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
//we use a React Context we'll sync to our Tanstack session entry.
//this way, components can easily read the session, Tanstack caches the value, and we can
//access queryClient in axios-config.ts and modify it outside components
export const AuthContext = createContext<AuthContextValues | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const queryClient = useQueryClient();
  const unverifiedSession: UserSessionData | null = tryLoadUserData();

  //We load any existing session into the context before verifying it's valid so the UI doesn't flicker
  //verifySession does return the session from the server itself or null if invalid, so it'll set the real session
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => verifySession(unverifiedSession),
    initialData: unverifiedSession,
    enabled: !!unverifiedSession,
    gcTime: Infinity,
    retry: false,
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
