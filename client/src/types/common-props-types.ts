import { ClassNameValue } from 'tailwind-merge';
import { MediaType } from '../../../shared/types/media';

export interface MediaTypeProps {
  mediaType: MediaType;
}

export interface OptStringProps {
  text?: string;
}

export interface OptBoolProps {
  condition?: boolean;
}
//this allows us to merge classnames so components can be called without an extra <div>
//while keeping their defaults
export interface OptClassNameProps {
  className?: ClassNameValue;
}
