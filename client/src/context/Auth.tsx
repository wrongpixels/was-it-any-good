import { createContext, JSX, useState } from 'react';
import { UserSessionData } from '../../../shared/types/models';
import { tryLoadUserData } from '../utils/session-storage';
import { setAxiosToken } from '../utils/axios-config';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type UseAuthContextValues = {
  session: UserSessionData | null;
  setSession: (session: UserSessionData | null) => void;
};

export const AuthContext: React.Context<UseAuthContextValues> =
  createContext<UseAuthContextValues>({
    session: tryLoadUserData(),
    setSession: () => {},
  });

//we create the context for the session but first try to load a existing one
const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  //either an existing session or nothing. Not verified yet.
  const unverifiedSession: UserSessionData | null = tryLoadUserData();

  //We set the token so the first fetch call can use it. It'll fail in the db if not valid and be removed.
  setAxiosToken(unverifiedSession?.token || null);

  //If existing, we first set the unverified session to show the logged-in UI.
  const [session, setSession]: [
    UserSessionData | null,
    React.Dispatch<React.SetStateAction<UserSessionData | null>>,
  ] = useState<UserSessionData | null>(unverifiedSession);
  /*
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
          const apiError: APIError | null = getAPIError(error);
          if (isAuthError(apiError)) {
            console.log(apiError.message);
            eraseUserSession();
            setSession(null);
          }
        },
      });
    }
  }, []); */

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
