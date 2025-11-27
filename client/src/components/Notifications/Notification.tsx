import { JSX, useEffect, useState, useMemo, useRef, memo } from 'react';
import {
  DEF_NOTIFICATION_DURATION,
  DEF_NOTIFICATION_OUT_TIME,
} from '../../constants/notification-constants';
import { NotificationProps } from '../../types/notification-types';

const classColors = (isError: boolean): string =>
  isError ? 'text-red-400 bg-red-100' : 'text-notigreen bg-notigreenbg';

const NotificationAlert = ({
  message,
  isError = false,
  onComplete,
  duration = DEF_NOTIFICATION_DURATION,
  anchorRef,
  offset,
  id,
  ...props
}: NotificationProps): JSX.Element | null => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animationFrame1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    const timeoutToFadeout = window.setTimeout(() => {
      setIsExiting(true);
    }, duration);

    const timeoutToStop = window.setTimeout(() => {
      onComplete?.();
    }, duration + DEF_NOTIFICATION_OUT_TIME);

    return () => {
      cancelAnimationFrame(animationFrame1);
      clearTimeout(timeoutToFadeout);
      clearTimeout(timeoutToStop);
    };
  }, []);

  useEffect(() => {
    const notificationEl = notificationRef.current;
    if (!notificationEl) return;

    const calculateAndSetPosition = () => {
      const rect = anchorRef?.current?.getBoundingClientRect();
      if (rect) {
        const top = rect.bottom - (offset?.y || 0);
        const left = rect.left + rect.width / 2 + (offset?.x || 0);
        notificationEl.style.top = `${top}px`;
        notificationEl.style.left = `${left}px`;
      } else {
        const topOffset = offset?.y ? `${offset.y}px` : '0px';
        const leftOffset = offset?.x ? `${offset.x}px` : '0px';
        notificationEl.style.top = `calc(50px + ${topOffset})`;
        notificationEl.style.left = `calc(50% + ${leftOffset})`;
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
  }, [anchorRef, offset]);

  const animationClasses = useMemo((): string => {
    if (isExiting) {
      return 'transform transition-all duration-500 ease-out translate-y-5 opacity-0 scale-103';
    }
    if (isVisible) {
      return 'transform transition-all duration-150 ease-in translate-y-0 opacity-100 scale-100';
    }

    return 'transform translate-y-3 opacity-0 scale-90 scale-x-70';
  }, [isVisible, isExiting]);

  return (
    <div
      {...props}
      ref={notificationRef}
      className={`font-bold shadow-md ${animationClasses} ${classColors(isError)} 
        -translate-x-1/2 text-center leading-tight text-sm flex justify-center 
        border-3 rounded-md px-2 mt-2 py-1 z-[9999]`}
      style={{ position: 'fixed' }}
    >
      <span role="alert" className="w-fit whitespace-pre-line">
        {message}
      </span>
    </div>
  );
};

export default memo(NotificationAlert);
