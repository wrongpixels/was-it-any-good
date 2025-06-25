import { createContext, JSX, useEffect, useState } from 'react';
import { UserSessionData } from '../../../shared/types/models';
import {
  eraseUserSession,
  saveUserSession,
  tryLoadUserData,
} from '../utils/session-storage';
import { useAuthVerifyMutation } from '../queries/login-queries';
import { getAPIError, isAuthError } from '../utils/error-handler';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthContextValues = {
  session: UserSessionData | null;
  setSession: (session: UserSessionData | null) => void;
};

export const AuthContext: React.Context<AuthContextValues> =
  createContext<AuthContextValues>({
    session: tryLoadUserData(),
    setSession: () => {},
  });

//we create the context for the session but first try to load any existing
const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const unverifiedSession: UserSessionData | null = tryLoadUserData();

  //the mutation to verify the session loaded is not expired or the user has been banned.
  const verifySessionMutation = useAuthVerifyMutation();

  //If existing, we first set the unverified session to show the logged-in UI.
  const [session, setSession] = useState<UserSessionData | null>(
    unverifiedSession
  );

  //If a session was recovered, we verify it with a mutation
  useEffect(() => {
    if (unverifiedSession) {
      verifySessionMutation.mutate(unverifiedSession, {
        onSuccess: (session: UserSessionData) => {
          //if verified, we set it to the App context and update the local storage
          saveUserSession(session);
          setSession(session);
        },
        onError: (error: Error) => {
          // We don't remove the session unless auth error to avoid kicking out on simple fetch issues.
          const apiError = getAPIError(error);
          if (isAuthError(apiError)) {
            console.log(apiError.message);
            eraseUserSession();
            setSession(null);
          }
        },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
