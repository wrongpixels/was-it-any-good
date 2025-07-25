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
  animKey: AnimKey;
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
  stopAnim: (animKey: AnimKey) => void;
}

export const AnimationContext = createContext<AnimEngineValues | null>(null);

export const AnimationProvider = ({ children }: PropsWithChildren) => {
  const [activeAnimations, setActiveAnimations] = useState<Map<AnimKey, Anim>>(
    new Map()
  );

  const playAnim = ({
    animKey,
    animationClass,
    options = {},
  }: AnimPlayParams) => {
    const loop: AnimLoop = options.loop === false ? 1 : (options.loop ?? 1);
    const animation: Anim = { animationClass, loop };
    console.log('Playing', animKey);

    stopAnim(animKey);
    setActiveAnimations((prev) => {
      const newMap = new Map(prev);
      newMap.set(animKey, animation);
      console.log('Playing', animKey, 'active:', newMap.size);

      return newMap;
    });
  };

  const stopAnim = (animKey: AnimKey) => {
    setActiveAnimations((prev) => {
      if (!prev.has(animKey)) {
        return prev;
      }
      const newMap = new Map(prev);
      newMap.delete(animKey);
      console.log('stopping', animKey, 'active:', prev.size);

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

export const useAnimEngine = (): AnimValues => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return {
    playAnim: context.playAnim,
    stopAnim: context.stopAnim,
  };
};
