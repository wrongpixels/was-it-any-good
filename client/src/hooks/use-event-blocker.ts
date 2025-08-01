import { useEffect } from 'react';

const blockEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const passiveOptions: AddEventListenerOptions = {
  passive: false,
};

const useEventBlocker = <K extends keyof WindowEventMap>(
  isBlocked: boolean,
  events: K[]
) => {
  useEffect(() => {
    if (!isBlocked) {
      return;
    }

    events.forEach((event) => {
      window.addEventListener(event, blockEvent, passiveOptions);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, blockEvent, passiveOptions);
      });
    };
  }, [isBlocked, events]);
};

export default useEventBlocker;
