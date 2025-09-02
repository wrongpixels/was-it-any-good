//a simple hook that scrolls to top when the current url changes
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = (): void => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0), [pathname];
  });
};

export default useScrollToTop;
