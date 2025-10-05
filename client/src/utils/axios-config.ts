import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { isSessionAuthError } from './error-handler';
import { logoutClientSide } from './session-handler';

export const setupAxiosInterceptors = (queryClient: QueryClient): void => {
  console.log('Axios interceptors set up');
  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      console.log(error);
      if (isSessionAuthError(error)) {
        console.log('SessionAuthError! Logging out client-side.', error);
        logoutClientSide(queryClient);
        window.location.reload();
      }

      return Promise.reject(error);
    }
  );
};

export const setAxiosToken = (token: string | null): void => {
  if (token) {
    console.log('Axios token set');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    removeAxiosToken();
  }
};

export const removeAxiosToken = () => {
  console.log('removed axios token');

  delete axios.defaults.headers.common['Authorization'];
};
