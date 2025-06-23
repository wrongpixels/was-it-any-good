import { JSX, useEffect, useState, useCallback } from 'react';

const DEF_ANIMATION_DURATION = 3000;
const ANIMATION_OUT_DURATION = 500;

enum NotiStatus {
  Idle,
  Started,
  Running,
  Expiring,
  Expired,
}

export interface NotificationValues {
  message: string;
  isError?: boolean;
  onComplete?: VoidFunction;
  duration: number;
}

export const DEF_NOTIFICATION: NotificationValues = {
  message: '',
  isError: false,
  duration: DEF_ANIMATION_DURATION,
};

const classColors = (isError: boolean): string =>
  isError ? 'text-red-400 bg-red-100' : 'text-notigreen bg-notigreenbg';

const Notification = ({
  message,
  isError = false,
  onComplete,
  duration,
}: NotificationValues): JSX.Element | null => {
  const [status, setStatus] = useState<NotiStatus>(NotiStatus.Expired);

  const classAnimation = useCallback((): string => {
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
  }, [status]);

  useEffect(() => {
    if (!message) {
      setStatus(NotiStatus.Expired);
      return;
    }

    let animationFrame1: number;
    let animationFrame2: number;
    let timeoutToFadeout: number;
    let timeoutToStop: number;

    setStatus(NotiStatus.Started);

    //We nest 2 animation frame requests here to force the animation trigger on render
    animationFrame1 = requestAnimationFrame(() => {
      animationFrame2 = requestAnimationFrame(() => {
        setStatus(NotiStatus.Running);
      });
    });

    timeoutToFadeout = setTimeout(
      () => setStatus(NotiStatus.Expiring),
      duration
    );
    timeoutToStop = setTimeout(() => {
      setStatus(NotiStatus.Expired);
      onComplete?.();
    }, duration + ANIMATION_OUT_DURATION);

    return () => {
      //to clean the animation
      cancelAnimationFrame(animationFrame1);
      cancelAnimationFrame(animationFrame2);
      clearTimeout(timeoutToFadeout);
      clearTimeout(timeoutToStop);
    };
  }, [message, onComplete]);

  if (!message || status === NotiStatus.Expired) {
    return null;
  }

  return (
    <div
      className={`font-bold shadow-md ${classAnimation()} ${classColors(isError)} 
        text-center leading-tight text-sm flex justify-center 
        border-3 rounded-md p-1 m-2`}
    >
      {message}
    </div>
  );
};

export default Notification;
