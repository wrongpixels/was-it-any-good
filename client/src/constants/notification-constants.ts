import { offset } from '../../../shared/types/common';
import { NotificationProps } from '../types/notification-types';

export const DEF_NOTIFICATION_DURATION: number = 3000;
export const DEF_NOTIFICATION_OUT_TIME: number = 500;

export const LOW_NOTIFICATION: offset = { x: 0, y: -40 };

export const DEF_NOTIFICATION: NotificationProps = {
  message: '',
  isError: false,
  duration: DEF_NOTIFICATION_DURATION,
};
