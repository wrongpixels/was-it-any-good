// Tailwind 4 recommends React Components or CSS components for style reuse, but none is ideal:
// - React component nesting is not flexible and its impractical for simple styling
// - CSS components individual values are always overriden when combined with classNames
// - Either hardcode CSS to imitate tw classes or increased bundle size using @apply directives

// This approach provides a simple way to reuse Tailwind classNames in a predictable way,
// making them easy to use, combine and extend.

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
