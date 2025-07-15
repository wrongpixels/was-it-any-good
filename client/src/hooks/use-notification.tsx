import { useRef, useState } from 'react';
import { DEF_NOTIFICATION } from '../components/notifications/Notification';
import { DEF_OFFSET, offset } from '../../../shared/types/common';
import {
  NotificationProps,
  UseNotificationValues,
} from '../types/notification-types';

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
      anchorRef: anchorRef,
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

  const getNotificationProps = (): NotificationProps => ({
    message: value.message,
    isError: value.isError || false,
    duration: value.duration,
    onComplete: clear,
    anchorRef: value.anchorRef,
    offset: value.offset,
  });

  return {
    setError,
    setNotification,
    clear,
    getProps: getNotificationProps,
    anchorRef,
  };
};
