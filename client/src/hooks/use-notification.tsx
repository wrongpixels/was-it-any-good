import { JSX, useMemo, useState } from 'react';
import Notification, { DEF_NOTIFICATION } from '../components/Notification';

export interface UseNotificationValues {
  setNotification: (message: string, duration?: number) => void;
  setError: (message: string, duration?: number) => void;
  clear: VoidFunction;
  field: JSX.Element;
}
export const useNotification = (): UseNotificationValues => {
  const [value, setValue] = useState(DEF_NOTIFICATION);

  const setGeneric = (
    message: string,
    isError: boolean,
    duration: number
  ): void => {
    const constrainedDuration: number = Math.min(
      10000,
      Math.max(500, duration)
    );
    setValue({ message, isError, duration: constrainedDuration });
  };

  const setNotification = (
    message: string,
    duration: number = DEF_NOTIFICATION.duration
  ) => setGeneric(message, false, duration);

  const setError = (
    message: string,
    duration: number = DEF_NOTIFICATION.duration
  ) => setGeneric(message, true, duration);

  const clear = () => setValue(DEF_NOTIFICATION);

  const field: JSX.Element = useMemo(
    () => (
      <Notification
        message={value.message}
        isError={value.isError}
        onComplete={clear}
        duration={value.duration}
      />
    ),
    [value.message, value.isError, value.duration]
  );

  return { setError, setNotification, clear, field };
};
