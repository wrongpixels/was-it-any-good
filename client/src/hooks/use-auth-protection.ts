//a hook that checks if a valid session is active or throws the user back
//to home page with an error notification.

import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../context/NotificationProvider';
import { useAuth } from './use-auth';
import { useEffect } from 'react';

//to be used in routes and components we want to protect. Has a boolean
//so it can be used in components that only need checking auth in some situations

interface AuthProtectionOptions {
  condition?: boolean;
}

const useAuthProtection = ({ condition = true }: AuthProtectionOptions) => {
  const { setError } = useNotificationContext();
  const navigate: NavigateFunction = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (condition) {
      if (!session) {
        navigate('/', { replace: true });
        setError({ message: 'You need to be logged in to access this page.' });
      }
    }
  }, [session, condition]);
};

export default useAuthProtection;
