// Tailwind's official style reuse patterns (React Components or CSS Components) is not ideal:
// - Nesting React components is inflexible and impractical for simple styling.
// - CSS components have 2 major shortcomings:
//   1. Unpredictable: They are always overridden by utility classNames.
//   2. You must either write raw CSS (abandoning Tailwind's classes) or use @apply
//    (making the final build bigger).

// This approach uses JS objects + tailwind-merge to easily reuse and combine with Tailwind
// classes in a predicable way ('last one wins'), solving all of the above.

const transitions = {
  baseZoom: 'transition-all duration-70 ease-out',
  baseHover: 'transition-all duration-40 ease-out',
};

export const styles = {
  animations: {
    zoomOnHover: `${transitions.baseZoom} hover:scale-107`,
    zoomLessOnHover: `${transitions.baseZoom} hover:scale-103`,
    zoomMoreOnHover: `${transitions.baseZoom} hover:scale-115`,
    upOnHover: `${transitions.baseHover} hover:-translate-y-1`,
    upOnHoverShort: `${transitions.baseHover} hover:-translate-y-0.5`,
  },
  shadow: {
    subtle: 'shadow-sm shadow-black/10',
  },
  inputField: {
    header:
      'ring-0 hover:ring-1 ring-amber-200 py-1 focus:ring-2 focus:ring-sky-300',
    search: 'border pl-7 text-base py-1.5 w-80 shadow-md shadow-black/5',
  },
  poster: {
    suggestions:
      'bg-white border-6 border-white rounded-sm min-w-42 min-h-58 shadow-sm ring-1 ring-gray-300 flex flex-col items-center',
    search:
      'bg-white border-6 border-white rounded-sm shadow-md ring-1 ring-gray-300',
  },
  buttons: {
    dark: 'bg-cyan-800 hover:bg-cyan-600',
  },
  test: {
    redBg2: 'text-3xl font-bold text-black',
  },
};
