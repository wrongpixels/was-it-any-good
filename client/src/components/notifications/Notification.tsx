import { JSX, useEffect, useState, useCallback, CSSProperties } from 'react';
import { offset } from '../../../../shared/types/common';

const DEF_ANIMATION_DURATION = 3000;
const ANIMATION_OUT_DURATION = 500;

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
  onComplete?: VoidFunction;
  duration: number;
  ref?: React.RefObject<HTMLDivElement | null>;
  offset?: offset;
}

export const DEF_NOTIFICATION: NotificationProps = {
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
  ref,
  offset,
}: NotificationProps): JSX.Element | null => {
  const [status, setStatus] = useState<NotiStatus>(NotiStatus.Expired);

  const [, forceUpdate] = useState({});

  useEffect(() => {
    // If we received a reference, we force re-render every animation frame
    // to make it stay in place
    if (!message || status === NotiStatus.Expired || !rect) {
      return;
    }

    //we request animation frames to force the re-render
    const updateFrame = () => {
      forceUpdate({});
      frameId = requestAnimationFrame(updateFrame);
    };
    let frameId = requestAnimationFrame(updateFrame);

    return () => cancelAnimationFrame(frameId);
  }, [message, status]);

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
  const rect: DOMRect | undefined = ref?.current?.getBoundingClientRect();
  if (rect && offset) {
    rect.x += offset.x;
    rect.y -= offset.y;
  }
  const positionStyles: CSSProperties = rect
    ? {
        position: 'fixed' as const,
        left: `${rect.left + rect.width / 2}px`,
        //We place it at the bottom of the reference rect by default
        top: rect.bottom + 5,
        transform: 'translateX(-50%)' as const,
      }
    : {};

  return (
    <div
      className={`font-bold shadow-md ${classAnimation()} ${classColors(isError)} 
        text-center leading-tight text-sm flex justify-center 
        border-3 rounded-md px-2 py-1 z-[9999]`}
      style={positionStyles}
    >
      <span className="w-fit whitespace-pre-line">{message}</span>
    </div>
  );
};

export default Notification;
