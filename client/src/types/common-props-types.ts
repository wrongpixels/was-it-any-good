import { MediaType } from '../../../shared/types/media';

//this allows us to merge classnames so components can be called without an extra <div>
//while keeping their defaults
export interface OptClassNameProps {
  className?: string;
  title?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export interface MediaTypeProps extends OptClassNameProps {
  mediaType?: MediaType;
}

export interface OptStringProps extends OptClassNameProps {
  text?: string;
}

export interface OptBoolProps extends OptClassNameProps {
  condition?: boolean;
}

export interface OptIconProps extends OptClassNameProps {
  condition?: boolean;
  width?: number;
  height?: number;
  url?: string;
  newTab?: boolean;
  defClassName?: string;
}
