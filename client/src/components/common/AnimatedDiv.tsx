import { useContext, useRef, useEffect, CSSProperties } from 'react';
import {
  Anim,
  AnimKey,
  AnimationContext,
} from '../../context/AnimationProvider';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { isNumber } from '../../../../shared/helpers/format-helper';

//a custom "<div>" that can receive animations from any component using its key.
//it looks for an entry matching its key in AnimationContext and takes the className from there
//then waits until the animation is done to trigger its removal from AnimationContext

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  animKey: AnimKey;
  pointerEvents?: 'none' | 'auto';
}
export const AnimatedDiv = ({
  animKey,
  children,
  className,
  pointerEvents = 'auto',
  ...props
}: AnimatedDivProps) => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('AnimatedDiv must be used within an AnimationProvider');
  }

  //it's a nested div, so to remove pointer-events we have to alter the parent.
  const parentClassName: string = `relative pointer-events-${pointerEvents}`;
  const { activeAnimations, stopAnim: stop } = context;
  const divRef = useRef<HTMLDivElement | null>(null);
  const animation: Anim | undefined = activeAnimations.get(animKey);
  const loopIsNumber: boolean = isNumber(animation?.loop);

  useEffect(() => {
    const refNode: HTMLDivElement | null = divRef.current;
    if (!refNode || !animation) {
      return;
    }

    if (loopIsNumber) {
      const handleAnimationEnd = () => {
        if (activeAnimations.get(animKey) === animation) {
          stop(animKey);
        }
      };
      refNode.addEventListener('animationend', handleAnimationEnd);
      return () =>
        refNode.removeEventListener('animationend', handleAnimationEnd);
    }
  }, [animation, animKey, stop, loopIsNumber, context]);

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

  const duplicateStyle: boolean =
    !!animation && animationClass.toString().includes('animate-d-');

  return (
    <div className={parentClassName}>
      <div
        {...props}
        ref={divRef}
        className={mergeClassnames(className, animationClass)}
        style={inlineStyles}
      >
        {children}
      </div>
      {duplicateStyle && (
        <div className={`absolute inset-0 ${className}`}>{children}</div>
      )}
    </div>
  );
};
