import { createContext, JSX, useState } from 'react';
import { UserSessionData } from '../../../shared/types/models';

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthContextValues = {
  session: UserSessionData | null;
  setSession: (session: UserSessionData | null) => void;
};

export const AuthContext: React.Context<AuthContextValues> =
  createContext<AuthContextValues>({ session: null, setSession: () => {} });

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [session, setSession] = useState<UserSessionData | null>(null);
  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
