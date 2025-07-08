export const DEF_STAR_PADDING: number = 25;
export const RATING_SCALES = [
  'scale-115',
  'scale-120',
  'scale-125',
  'scale-130',
  'scale-140',
];
export const RATING_DELAYS = [
  'delay-0',
  'delay-2',
  'delay-4',
  'delay-6',
  'delay-8',
];
export const RATING_DURATIONS = [
  'duration-100',
  'duration-105',
  'duration-110',
  'duration-115',
  'duration-120',
];

type ColorVariant = 'default' | 'hover' | 'selected' | 'delete';

export const RATING_COLORS: Record<ColorVariant, string> = {
  default: 'text-[#6d90cf]',
  hover: 'text-green-600',
  selected: 'text-yellow-500',
  delete: 'text-red-500',
};
