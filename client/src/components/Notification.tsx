import { JSX, useEffect, useState } from 'react';

enum NotiStatus {
  Idle,
  Started,
  Running,
  Expiring,
  Expired,
}

interface NotificationProps {
  message: string;
  isError?: boolean;
}

interface NotificationStatus {
  status: NotiStatus;
}

const DEF_NOTIFICATION: NotificationProps = {
  message: '',
  isError: false,
};

const DEF_STATUS: NotificationStatus = {
  status: NotiStatus.Expired,
};

const classColors = (isError: boolean): string =>
  isError ? 'text-red-400 bg-red-100' : 'text-notigreen bg-notigreenbg';

const Notification = ({
  message,
  isError = false,
}: NotificationProps): JSX.Element | null => {
  const [notification, setNotification] = useState(DEF_NOTIFICATION);
  const [{ status }, setStatus] = useState(DEF_STATUS);

  const classAnimation = (): string => {
    switch (status) {
      case NotiStatus.Started:
        return 'transform translate-y-0 opacity-0 scale-90';
      case NotiStatus.Running:
        return 'transform transition-all duration-200 ease-in-out translate-y-0 opacity-100 scale-100';
      case NotiStatus.Expiring:
        return 'transform transition-all duration-500 ease-in-out translate-y-4 opacity-0 scale-103';
      default:
        return 'opacity-0';
    }
  };

  useEffect(() => {
    if (message !== notification.message) {
      setNotification({ message, isError });
      setStatus({ status: NotiStatus.Started });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStatus({ status: NotiStatus.Running });
        });
      });

      setTimeout(() => setStatus({ status: NotiStatus.Expiring }), 2000);
      setTimeout(() => setStatus({ status: NotiStatus.Expired }), 2500);
    }
  }, [message]);

  if (!notification.message || status === NotiStatus.Expired) {
    return null;
  }

  return (
    <div
      className={`font-bold shadow-md ${classAnimation()} ${classColors(notification.isError || false)} 
        text-center leading-tight text-sm flex justify-center 
        border-3 rounded-md p-1 m-2`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
