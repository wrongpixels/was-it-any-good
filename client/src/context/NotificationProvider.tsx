import {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
  RefObject,
  useRef,
} from 'react';
import {
  NotificationProps,
  SendNotificationProps,
} from '../types/notification-types';
import NotificationAlert, {
  DEF_NOTIFICATION,
} from '../components/notifications/Notification';
import { DEF_OFFSET, offset } from '../../../shared/types/common';

type NotificationData = NotificationProps & { id: number };

export interface NotificationContextValues {
  show: (props: NotificationProps) => void;
  setNotification: (props: SendNotificationProps) => void;
  setError: (props: SendNotificationProps) => void;
  anchorRef: RefObject<HTMLDivElement | null>;
}

const NotificationContext = createContext<
  NotificationContextValues | undefined
>(undefined);

let notificationId = 0;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeNotification, setActiveNotification] =
    useState<NotificationData | null>(null);

  const setNotification = (props: SendNotificationProps) =>
    setGeneric(
      props.message,
      false,
      props.duration,
      props.offset,
      props.anchorRef
    );

  const setError = (props: SendNotificationProps) =>
    setGeneric(
      props.message,
      true,
      props.duration,
      props.offset,
      props.anchorRef
    );

  const setGeneric = (
    message: string,
    isError: boolean,
    duration: number = DEF_NOTIFICATION.duration,
    offset: offset = DEF_OFFSET,
    anchorRef?: RefObject<HTMLElement | null>
  ): void => {
    show({
      message,
      isError,
      duration: Math.min(10000, Math.max(500, duration)),
      offset,
      anchorRef,
    });
  };

  const show = useCallback((props: NotificationProps) => {
    setActiveNotification({ ...props, id: ++notificationId });
  }, []);

  return (
    <NotificationContext.Provider value={{ show, setError, setNotification }}>
      {children}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
        {activeNotification && (
          <NotificationAlert
            key={activeNotification.id}
            {...activeNotification}
            onComplete={() => {
              setActiveNotification(null);
              activeNotification.onComplete?.();
            }}
          />
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }

  const anchorRef = useRef<HTMLDivElement>(null);

  const setNotification = useCallback(
    (props: Omit<SendNotificationProps, 'anchorRef'>) => {
      context.setNotification({ ...props, anchorRef });
    },
    [context]
  );

  const setError = useCallback(
    (props: Omit<SendNotificationProps, 'anchorRef'>) => {
      context.setError({ ...props, anchorRef });
    },
    [context]
  );

  return {
    ...context,
    setNotification,
    setError,
    anchorRef,
  };
};
