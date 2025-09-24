import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import removeConsole from 'vite-plugin-remove-console';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  //we use this plugin only in production to make
  //it easier to remove frontend console logs.
  //we could make our own logger, but muscular memory
  //of 'console.log' is difficult to avoid!

  if (mode === 'production') {
    plugins.push(removeConsole());
  }
  return {
    plugins,
    test: {
      environment: 'jsdom',
      setupFiles: 'src/test/setup.ts',
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:6060',
      },
    },
  };
});
