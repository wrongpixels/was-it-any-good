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
import NotificationAlert from '../components/Notifications/Notification'; // Adjust path to your component file
import { DEF_OFFSET, offset } from '../../../shared/types/common';
import { DEF_NOTIFICATION } from '../constants/notification-constants';

export interface NotificationContextValues {
  show: (props: NotificationProps) => void;
  setNotification: (props: SendNotificationProps) => void;
  setError: (props: SendNotificationProps) => void;
  anchorRef?: RefObject<HTMLDivElement | null>;
}

const NotificationContext = createContext<
  NotificationContextValues | undefined
>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeNotification, setActiveNotification] =
    useState<NotificationProps | null>(null);

  const setGeneric = useCallback(
    (
      message: string,
      isError: boolean,
      duration: number = DEF_NOTIFICATION.duration,
      offset: offset = DEF_OFFSET,
      anchorRef?: RefObject<HTMLDivElement | null>
    ): void => {
      show({
        message,
        isError,
        duration: Math.min(10000, Math.max(500, duration)),
        offset,
        anchorRef,
      });
    },
    []
  );

  const setNotification = useCallback(
    (props: SendNotificationProps) =>
      setGeneric(
        props.message,
        false,
        props.duration,
        props.offset,
        props.anchorRef
      ),
    [setGeneric]
  );

  const setError = useCallback(
    (props: SendNotificationProps) =>
      setGeneric(
        props.message,
        true,
        props.duration,
        props.offset,
        props.anchorRef
      ),
    [setGeneric]
  );

  const show = useCallback((props: NotificationProps) => {
    setActiveNotification(props);
  }, []);

  const handleComplete = useCallback(() => {
    setActiveNotification(null);
    activeNotification?.onComplete?.();
  }, [activeNotification]);

  return (
    <NotificationContext.Provider value={{ show, setNotification, setError }}>
      {children}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
        {activeNotification && (
          <NotificationAlert
            {...activeNotification}
            onComplete={handleComplete}
          />
        )}
      </div>
    </NotificationContext.Provider>
  );
};
export const useNotificationContext = (): NotificationContextValues => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const setNotification = useCallback(
    (props: SendNotificationProps) => {
      const finalAnchorRef = props.anchorRef;
      context.setNotification({ ...props, anchorRef: finalAnchorRef });
    },
    [context, anchorRef]
  );

  const setError = useCallback(
    (props: SendNotificationProps) => {
      const finalAnchorRef = props.anchorRef;
      context.setError({ ...props, anchorRef: finalAnchorRef });
    },
    [context, anchorRef]
  );

  return {
    ...context,
    setNotification,
    setError,
    anchorRef,
  };
};
