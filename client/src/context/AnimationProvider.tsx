import {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from 'react';

export type AnimKey = number | string;
export type AnimLoop = boolean | number;

export interface AnimOptions {
  loop?: AnimLoop;
}

export interface AnimPlayParams {
  key: AnimKey;
  animationClass: string;
  options?: AnimOptions;
}

export interface Anim {
  animationClass: string;
  loop: AnimLoop;
}

interface AnimEngineValues {
  activeAnimations: Map<AnimKey, Anim>;
  playAnim: (params: AnimPlayParams) => void;
  stopAnim: (key: AnimKey) => void;
}

export const AnimationContext = createContext<AnimEngineValues | null>(null);

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const [activeAnimations, setActiveAnimations] = useState<Map<AnimKey, Anim>>(
    new Map()
  );

  const playAnim = ({ key, animationClass, options = {} }: AnimPlayParams) => {
    const loop: AnimLoop = options.loop === false ? 1 : (options.loop ?? 1);
    const animation: Anim = { animationClass, loop };
    console.log('Playing', key);

    stopAnim(key);
    setActiveAnimations((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, animation);
      console.log('Playing', key, 'active:', newMap.size);

      return newMap;
    });
  };

  const stopAnim = (key: AnimKey) => {
    setActiveAnimations((prev) => {
      if (!prev.has(key)) {
        return prev;
      }
      const newMap = new Map(prev);
      newMap.delete(key);
      console.log('stopping', key, 'active:', prev.size);

      return newMap;
    });
  };

  const value = useMemo(
    () => ({ activeAnimations, playAnim, stopAnim }),
    [activeAnimations]
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

interface AnimValues extends Omit<AnimEngineValues, 'activeAnimations'> {}

export const useAnimation = (): AnimValues => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return {
    playAnim: context.playAnim,
    stopAnim: context.stopAnim,
  };
};
