import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthProvider.tsx';
import { setupAxiosInterceptors } from './utils/axios-config.ts';
import { PageInfoProvider } from './context/PageInfoProvider.tsx';

const queryClient = new QueryClient();
setupAxiosInterceptors(queryClient);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PageInfoProvider>
          <App />
        </PageInfoProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
