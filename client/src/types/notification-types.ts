import { offset } from '../../../shared/types/common';

export interface NotificationProps {
  message: string;
  isError: boolean;
  duration: number;
  id?: number;
  onComplete?: VoidFunction;
  offset?: offset;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export interface SendNotificationProps {
  message: string;
  isError?: boolean;
  duration?: number;
  onComplete?: VoidFunction;
  offset?: offset;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export interface UseNotificationValues {
  setNotification: (
    message: string,
    duration?: number,
    offset?: offset
  ) => void;
  setError: (message: string, duration?: number, offset?: offset) => void;
  clear: VoidFunction;
  getProps: () => NotificationProps;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}
