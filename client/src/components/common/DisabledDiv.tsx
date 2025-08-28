import { styles } from '../../constants/tailwind-styles';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface DisabledDivProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
}

const DisabledDiv = ({
  disabled,
  className,
  children,
  ...rest
}: DisabledDivProps) => {
  const displayClassname: string = disabled
    ? mergeClassnames(styles.disabled.regular, className)
    : className || '';
  return (
    <div className={displayClassname} aria-disabled={disabled} {...rest}>
      {children}
    </div>
  );
};

export default DisabledDiv;
