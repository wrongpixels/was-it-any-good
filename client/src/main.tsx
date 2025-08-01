import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthProvider.tsx';
import { setupAxiosInterceptors } from './utils/axios-config.ts';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import { AnimationProvider } from './context/AnimationProvider.tsx';
import OverlayProvider from './context/OverlayProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

setupAxiosInterceptors(queryClient);

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnimationProvider>
          <NotificationProvider>
            <OverlayProvider>
              <App />
            </OverlayProvider>
          </NotificationProvider>
        </AnimationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
