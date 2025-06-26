import { JSX, useMemo, useRef, useState } from 'react';
import Notification, { DEF_NOTIFICATION } from '../components/Notification';
import { DEF_OFFSET, offset } from '../../../shared/types/common';
export interface UseNotificationValues {
  setNotification: (
    message: string,
    duration?: number,
    offset?: offset
  ) => void;
  setError: (message: string, duration?: number, offset?: offset) => void;
  clear: VoidFunction;
  field: JSX.Element;
  ref: React.RefObject<HTMLDivElement | null>;
}

export const useNotification = (): UseNotificationValues => {
  const [value, setValue] = useState(DEF_NOTIFICATION);
  const containerRef = useRef<HTMLDivElement>(null);

  const setGeneric = (
    message: string,
    isError: boolean,
    duration: number = DEF_NOTIFICATION.duration,
    offset: offset = DEF_OFFSET
  ): void => {
    const constrainedDuration = Math.min(10000, Math.max(500, duration));
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    if (offset) {
      rect.x += offset.x;
      rect.y -= offset.y;
    }
    setValue({
      message,
      isError,
      duration: constrainedDuration,
      rect,
    });
  };

  const setNotification = (
    message: string,
    duration: number = DEF_NOTIFICATION.duration,
    offset?: offset
  ) => setGeneric(message, false, duration, offset);

  const setError = (
    message: string,
    duration: number = DEF_NOTIFICATION.duration,
    offset?: offset
  ) => setGeneric(message, true, duration, offset);

  const clear = () => setValue(DEF_NOTIFICATION);

  const field: JSX.Element = useMemo(
    () => (
      <Notification
        message={value.message}
        isError={value.isError}
        onComplete={clear}
        duration={value.duration}
        rect={value.rect}
      />
    ),
    [value.message, value.isError, value.duration]
  );

  return {
    setError,
    setNotification,
    clear,
    field,
    ref: containerRef,
  };
};
