import { JSX } from 'react';

interface NotificationProps {
  message: string;
  isError?: boolean;
}

const classColors = (isError: boolean): string =>
  isError ? 'text-red-400 bg-red-100' : 'text-notigreen bg-notigreenbg';

const Notification = ({
  message,
  isError = false,
}: NotificationProps): JSX.Element | null => {
  if (!message) {
    return null;
  }
  return (
    <div
      className={`font-bold shadow-md ${classColors(isError)} text-center leading-tight text-sm flex justify-center border-3 rounded-md p-1 m-2`}
    >
      {message}
    </div>
  );
};
export default Notification;
