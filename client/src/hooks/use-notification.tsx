import { JSX, useMemo, useRef, useState } from 'react';
import Notification, {
  DEF_NOTIFICATION,
} from '../components/notifications/Notification';
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
  const anchorRef = useRef<HTMLDivElement>(null);

  const setGeneric = (
    message: string,
    isError: boolean,
    duration: number = DEF_NOTIFICATION.duration,
    offset: offset = DEF_OFFSET
  ): void => {
    const constrainedDuration = Math.min(10000, Math.max(500, duration));

    const rect: DOMRect | undefined =
      anchorRef?.current?.getBoundingClientRect();
    if (rect && offset) {
      if (offset.x) {
        rect.x += offset.x;
      }
      if (offset.y) {
        rect.y -= offset.y;
      }
    }

    setValue({
      message,
      isError,
      duration: constrainedDuration,
      ref: anchorRef,
      offset,
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
        ref={value.ref}
        offset={value.offset}
      />
    ),
    [value.message, value.isError, value.duration, value.ref, value.offset]
  );

  return {
    setError,
    setNotification,
    clear,
    field,
    ref: anchorRef,
  };
};
