import {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { NotificationProps } from '../types/notification-types';
import NotificationAlert from '../components/notifications/Notification';

// Define the shape of a single notification in our state
// We add a unique ID to track it
type NotificationData = NotificationProps & { id: number };

// Define what the context will provide: a function to show a notification
interface NotificationContextType {
  show: (props: Omit<NotificationData, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

let notificationId = 0;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Function to remove a notification by its ID
  const remove = useCallback((id: number) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }, []);

  // Function to add a new notification
  const show = useCallback((props: Omit<NotificationData, 'id'>) => {
    const newId = notificationId++;
    setNotifications((current) => [...current, { ...props, id: newId }]);
  }, []);

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      {/* 
        This is the container where all notifications will be rendered,
        completely separate from the rest of your app's component tree.
      */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
        {notifications.map((noti) => (
          <NotificationAlert
            key={noti.id}
            {...noti}
            // We hijack onComplete to remove the notification from state
            onComplete={() => {
              remove(noti.id);
              // Call the original onComplete if it was provided
              noti.onComplete?.();
            }}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// The hook that other components will use
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
