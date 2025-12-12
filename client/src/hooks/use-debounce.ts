import { useCallback, useRef, useState } from 'react';

const useDebounce = (rate: number = 500): [boolean, VoidFunction] => {
  const [waiting, setWaiting] = useState(false);

  //we store the ref to the active timeout id
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  if (rate === 0) {
    return [false, () => {}];
  }
  const setDebounce: VoidFunction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setWaiting(true);
    timeoutRef.current = setTimeout(() => {
      setWaiting(false);
      timeoutRef.current = null;
    }, rate);
  }, [rate]);

  return [waiting, setDebounce];
};

export default useDebounce;
