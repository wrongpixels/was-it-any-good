import axios from 'axios';
import { isSessionAuthError } from './error-handler';

export const setAxiosToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (isSessionAuthError(error)) {
          //do something to clean the context
          removeAxiosToken();
        }
        return Promise.reject(error);
      }
    );
  } else {
    removeAxiosToken();
  }
};

export const removeAxiosToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};
