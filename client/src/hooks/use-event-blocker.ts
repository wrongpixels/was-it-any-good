//a hook to disable events by name globally or on a target
//the 'isBlocked' props boolean controls if the events are blocked or not
import { useEffect } from 'react';

const blockEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const passiveOptions: AddEventListenerOptions = { passive: false };

type Target = HTMLElement | Document | Window | null | undefined;

const useEventBlocker = <K extends keyof DocumentEventMap>(
  isBlocked: boolean,
  events: K[],
  target: Target = window
) => {
  useEffect(() => {
    if (!isBlocked || !target) {
      return;
    }

    const add = (ev: K) =>
      target.addEventListener(ev, blockEvent as EventListener, passiveOptions);
    const remove = (ev: K) =>
      target.removeEventListener(
        ev,
        blockEvent as EventListener,
        passiveOptions
      );

    events.forEach(add);
    return () => {
      events.forEach(remove);
    };
  }, [isBlocked, target, ...events]);
};

export default useEventBlocker;
