import { useContext } from 'react';
import { AuthContext, AuthContextValues } from '../context/AuthProvider';

export const useAuth = (): AuthContextValues => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
