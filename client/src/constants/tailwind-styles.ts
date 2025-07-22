// Tailwind 4 recommends React Components or CSS components for style reuse, but none is ideal:
// - Impractical component nesting for simple style reuse
// - Numerous conflicts when combining CSS components with regular classNames
// - Increases bundle size when using @apply directives
// This approach provides a simpler way to compose and reuse Tailwind classes,
// maintaining control and avoiding conflicts.

export const styles = {
  animations: {
    zoomOnHover: 'transition-all duration-70 ease-out hover:scale-107',
    upOnHover: 'transition-all duration-40 ease-out hover:-translate-y-1',
    upOnHoverShort:
      'transition-all duration-40 ease-out hover:-translate-y-0.5',
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
      'bg-white border-6 border-white min-w-42 min-h-58 rounded-sm shadow-sm ring-1 ring-gray-300 flex flex-col items-center',
    search:
      'bg-white border-6 border-white rounded-sm shadow-md ring-1 ring-gray-300',
  },
};
