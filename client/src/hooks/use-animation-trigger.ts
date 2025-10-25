import { useEffect, useState } from 'react';

export const useAnimationTrigger = (
  duration: number = 100
): [boolean, () => void] => {
  const [trigger, setTrigger] = useState<boolean>(false);
  useEffect(() => {
    if (trigger) {
      setTimeout(() => setTrigger(false), duration + 50);
    }
  }, [trigger]);
  const useTrigger = (): void => setTrigger(true);
  return [trigger, useTrigger];
};
