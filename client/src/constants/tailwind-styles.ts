// Tailwind's official style reuse patterns (React Components or CSS Components) is not ideal:
// - Nesting React components is inflexible and impractical for simple styling.
// - CSS components have 2 major shortcomings:
//   1. Unpredictable: They are always overridden by utility classNames.
//   2. You must either write raw CSS (abandoning Tailwind's classes) or use @apply
//    (making the final build bigger).

import { BadgeType } from '../types/search-browse-types';

// This approach uses JS objects + tailwind-merge to easily reuse and combine with Tailwind
// classes in a predicable way ('last one wins'), solving all of the above.

const transitions = {
  slow: 'transition-all duration-70 ease-out',
  slower: 'transition-all duration-100 ease-out',
  fast: 'transition-all duration-40 ease-out',
  normal: 'transition-all duration-60 ease-out',
};

export const styles = {
  hyperlink: 'text-starblue hover:text-hoverblue',
  animations: {
    opacity70: `${transitions.slower} opacity-70 hover:opacity-100`,
    opacity80: `${transitions.slower} opacity-80 hover:opacity-100`,
    zoomOnHover: `${transitions.slow} hover:scale-107`,
    zoomLessOnHover: `${transitions.slow} hover:scale-103`,
    posterZoom: `${transitions.slow} hover:scale-101`,
    zoomMoreOnHover: `${transitions.slow} hover:scale-115`,
    upOnHover: `${transitions.fast} hover:-translate-y-1`,
    upOnHoverShort: `${transitions.fast} hover:-translate-y-0.5`,
    buttonRight: `${transitions.normal} hover:scale-101 hover:translate-x-0.25`,
    buttonLeft: `${transitions.normal} hover:scale-101 hover:-translate-x-0.25`,
  },
  shadow: {
    subtle: 'shadow-sm shadow-black/10',
    textShadow: '[text-shadow:_1px_2px_2px_rgb(0_0_0_/_0.2)]',
    allShadow: () =>
      `${styles.shadow.textShadow} [drop-shadow:_1px_2px_2px_rgb(0_0_0_/_0.3)]`,
  },
  inputField: {
    header:
      'ring-0 hover:ring-1 ring-amber-200 py-1 focus:ring-2 focus:ring-sky-300 text-xs  h-7',
    search: 'border pl-7 text-base py-1.5 w-80 shadow-md shadow-black/5',
    rules: (isError: boolean, isSuccess: boolean) =>
      `${isError ? 'focus:ring-red-400 ring-red-400 focus:ring-red-400 ring-2' : isSuccess ? 'focus:ring-green-300 ring-green-300 ring-2' : ''}`,
  },
  poster: {
    regular: () =>
      `bg-gradient-to-t from-gray-200/60 via-white to-white rounded-sm min-w-42 min-h-58 shadow-md ring-1 ring-gray-300 flex flex-col p-2 cursor-default`,

    animated: () =>
      `${styles.animations.posterZoom} ${styles.poster.regular()} cursor-pointer`,

    media: `${transitions.slow} ring-1 ring-gray-325 hover:scale-101 cursor-pointer`,
    suggestions:
      'bg-white border-6 border-white rounded-sm min-w-42 min-h-58 shadow-sm ring-1 ring-gray-300 flex flex-col items-center',
    search: {
      base: 'bg-white p-2 rounded-sm shadow-md ring-1 ring-gray-300 w-full bg-gradient-to-t to-white',
      byBadgeType: (badgeType: BadgeType, index: number) => {
        const baseClasses = `${styles.poster.search.base}`;

        if (badgeType === BadgeType.AddedBadge) {
          return `${baseClasses} from-green-500/15`;
        }
        if (badgeType === BadgeType.None || index >= 4) {
          return `${baseClasses} from-gray-100`;
        }

        const gradientColors: Record<number, string> = {
          1: 'from-gold/15',
          2: 'from-gray-400/30',
          3: 'from-darkbronze/15 ring-darkbronze',
        };

        return `${baseClasses} ring-2 ${gradientColors[index] ?? ''}`.trim();
      },
    },
  },
  gradient: {
    poster: 'bg-gradient-to-t from-gray-200/60 via-white to-white',
  },
  buttons: {
    blue: 'bg-starbutton border-1 border-black/15 text-white hover:bg-starbrighter',
    dark: 'bg-cyan-800 hover:bg-cyan-600',
  },
  test: {
    redBg2: 'text-3xl font-bold text-black',
  },
  disabled: {
    regular: 'pointer-events-none opacity-50',
  },
};
