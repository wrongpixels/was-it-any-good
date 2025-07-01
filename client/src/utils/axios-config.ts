import axios from 'axios';

export const setAxiosToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    removeAxiosToken();
  }
};

export const removeAxiosToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};
