import { JSX, useEffect, useState, useMemo, useRef, memo } from 'react';
import {
  DEF_NOTIFICATION_DURATION,
  DEF_NOTIFICATION_OUT_TIME,
} from '../../constants/notification-constants';
import { NotificationProps } from '../../types/notification-types';

enum NotiStatus {
  Idle,
  Started,
  Running,
  Expiring,
  Expired,
}

export const DEF_NOTIFICATION: NotificationProps = {
  message: '',
  isError: false,
  duration: DEF_NOTIFICATION_DURATION,
};

const classColors = (isError: boolean): string =>
  isError ? 'text-red-400 bg-red-100' : 'text-notigreen bg-notigreenbg';

const NotificationAlert = ({
  message,
  isError = false,
  onComplete,
  duration = DEF_NOTIFICATION_DURATION,
  anchorRef,
  offset,
  ...props
}: NotificationProps): JSX.Element | null => {
  const [status, setStatus] = useState<NotiStatus>(NotiStatus.Expired);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) {
      setStatus(NotiStatus.Expired);
      return;
    }
    let animationFrame1: number, animationFrame2: number;
    let timeoutToFadeout: number, timeoutToStop: number;

    setStatus(NotiStatus.Started);
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
    }, duration + DEF_NOTIFICATION_OUT_TIME);

    return () => {
      cancelAnimationFrame(animationFrame1);
      cancelAnimationFrame(animationFrame2);
      clearTimeout(timeoutToFadeout);
      clearTimeout(timeoutToStop);
    };
  }, [message, duration, onComplete]);

  useEffect(() => {
    const notificationEl = notificationRef.current;
    if (!notificationEl || status === NotiStatus.Expired) return;

    const calculateAndSetPosition = () => {
      const rect = anchorRef?.current?.getBoundingClientRect();
      if (rect) {
        const top = rect.bottom + 24 - (offset?.y || 0);
        const left = rect.left + rect.width / 2 + (offset?.x || 0);
        notificationEl.style.top = `${top}px`;
        notificationEl.style.left = `${left}px`;
        notificationEl.style.transform = 'translateX(-50%)';
      } else {
        const topOffset = offset?.y ? `${offset.y}px` : '0px';
        const leftOffset = offset?.x ? `${offset.x}px` : '0px';
        notificationEl.style.top = `calc(40px + ${topOffset})`;
        notificationEl.style.left = `calc(50% + ${leftOffset})`;
        notificationEl.style.transform = 'translateX(-50%)';
      }
    };

    if (anchorRef?.current) {
      let frameId: number;
      const updateLoop = () => {
        calculateAndSetPosition();
        frameId = requestAnimationFrame(updateLoop);
      };
      frameId = requestAnimationFrame(updateLoop);
      return () => cancelAnimationFrame(frameId);
    } else {
      calculateAndSetPosition();
    }
  }, [status, message, anchorRef, offset]);

  const animationClasses = useMemo((): string => {
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

  if (status === NotiStatus.Expired) {
    return null;
  }

  return (
    <div
      {...props}
      ref={notificationRef}
      className={`font-bold shadow-md ${animationClasses} ${classColors(isError)} 
        text-center leading-tight text-sm flex justify-center 
        border-3 rounded-md px-2 mt-2 py-1 z-[9999]`}
      style={{ position: 'fixed' }}
    >
      <span className="w-fit whitespace-pre-line">{message}</span>
    </div>
  );
};

export default memo(NotificationAlert);
