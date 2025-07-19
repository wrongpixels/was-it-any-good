import { useContext, useRef, useEffect, CSSProperties } from 'react';
import {
  Anim,
  AnimKey,
  AnimationContext,
} from '../../context/AnimationProvider';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { isNumber } from '../../../../shared/helpers/format-helper';

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  uniqueKey: AnimKey;
}
export const AnimatedDiv = ({
  uniqueKey,
  children,
  className,
  ...props
}: AnimatedDivProps) => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('AnimatedDiv must be used within an AnimationProvider');
  }
  const { activeAnimations, stop } = context;
  const divRef = useRef<HTMLDivElement | null>(null);

  const animation: Anim | undefined = activeAnimations.get(uniqueKey);

  const loopIsNumber: boolean = isNumber(animation?.loop);

  useEffect(() => {
    const refNode: HTMLDivElement | null = divRef.current;
    if (!refNode || !animation) {
      return;
    }

    if (loopIsNumber) {
      const handleAnimationEnd = () => {
        if (activeAnimations.get(uniqueKey) === animation) {
          stop(uniqueKey);
        }
      };
      refNode.addEventListener('animationend', handleAnimationEnd);
      return () =>
        refNode.removeEventListener('animationend', handleAnimationEnd);
    }
  }, [animation, uniqueKey, stop, activeAnimations]);

  const animationClass = animation?.animationClass || '';
  const inlineStyles: CSSProperties = { ...props.style };

  if (animation) {
    const { loop }: Anim = animation;
    if (loop === true) {
      inlineStyles.animationIterationCount = 'infinite';
    } else if (isNumber(loop)) {
      inlineStyles.animationIterationCount = loop;
    }
  }

  return (
    <div
      ref={divRef}
      className={mergeClassnames(className, animationClass)}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};
