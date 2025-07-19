import {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from 'react';
import { ClassValue } from 'clsx';

export type AnimKey = number | string;
export type AnimLoop = boolean | number;

export interface AnimOptions {
  loop?: AnimLoop;
}

export interface AnimPlayParams {
  key: AnimKey;
  animationClass: ClassValue;
  options?: AnimOptions;
}

export interface Anim {
  animationClass: ClassValue;
  loop: AnimLoop;
}

interface AnimEngineValues {
  activeAnimations: Map<AnimKey, Anim>;
  play: (params: AnimPlayParams) => void;
  stop: (key: AnimKey) => void;
}

export const AnimationContext = createContext<AnimEngineValues | null>(null);

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const [activeAnimations, setActiveAnimations] = useState<Map<AnimKey, Anim>>(
    new Map()
  );

  const play = ({ key, animationClass, options = {} }: AnimPlayParams) => {
    const loop: AnimLoop = options.loop === false ? 1 : (options.loop ?? 1);
    const animation: Anim = { animationClass, loop };

    setActiveAnimations((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, animation);
      return newMap;
    });
  };

  const stop = (key: AnimKey) => {
    setActiveAnimations((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  };

  const value = useMemo(
    () => ({ activeAnimations, play, stop }),
    [activeAnimations]
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return { play: context.play, stop: context.stop };
};
