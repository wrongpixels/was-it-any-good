//An util to merge classnames so we can "overwrite" parts with a single parameter

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const mergeClassnames = (...inputs: ClassValue[]) =>
  twMerge(clsx(inputs));
