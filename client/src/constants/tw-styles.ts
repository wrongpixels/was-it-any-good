//Tailwind 4 recommends React Components or css components for style reuse, but nose is ideal:
// - unpractical component nesting for simple style reuse
// - numerous conflicts when combining css components with regular classNames
// - Increases bundle size when using @apply directives
// This approach provides a simpler way to compose and reuse Tailwind classes,
// maintaining control and avoiding conflicts.

export const twStyles = {
  inputField: {
    header:
      'ring-0 hover:ring-1 ring-amber-200 py-1 focus:ring-2 focus:ring-sky-300',
    search: 'border pl-7 text-base py-1.5 w-80 shadow-md shadow-black/5',
  },
};
