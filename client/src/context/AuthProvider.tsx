import { createContext, JSX } from 'react';
import { useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { UserSessionData, LoginData } from '../../../shared/types/models';
import { tryLoadUserData, logoutClientSide } from '../utils/session-handler';
import {
  useLoginMutation,
  useLogoutMutation,
} from '../mutations/login-mutations';
import { AxiosResponse } from 'axios';
import { useSetActiveSession } from '../hooks/use-set-active-session';

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
}
//we use a React Context we'll sync to our Tanstack session entry.
//this way, components can easily read the session, Tanstack caches the value, and we can
//access queryClient in axios-config.ts and modify it outside components
export const AuthContext = createContext<AuthContextValues | undefined>(
  undefined
);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const queryClient = useQueryClient();
  const unverifiedSession: UserSessionData | null = tryLoadUserData();

  //We load any existing session into the context before verifying it's valid so the UI doesn't flicker
  //verifySession does return the session from the server itself or null if invalid, so it'll set the real session

  const { setSession } = useSetActiveSession();
  const session: UserSessionData | null = setSession(unverifiedSession);
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
        setSession(newSession);
        options?.onSuccess?.(newSession);
      },
      onError: (error: Error) => {
        setSession(null);
        options?.onError?.(error);
      },
    });
    return;
  };

  const logout = () => {
    logoutMutation.mutate(undefined);
    logoutClientSide(queryClient);
  };

  const value: AuthContextValues = {
    session: session || null,
    login,
    logout,
    isLoginPending: loginMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
