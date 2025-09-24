import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import AuthProvider from '../context/AuthProvider';
import { NotificationProvider } from '../context/NotificationProvider';
import { render, RenderOptions } from '@testing-library/react';
import OverlayProvider from '../context/OverlayProvider';

let queryClient: QueryClient | undefined = undefined;

//a custom wrapper for components that require the Provider chain
export const TestProviderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={createQueryClient()}>
      <NotificationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

//a custom wrapper for components that require the Provider chain
export const TestProviderAndOverlayWrapper = ({
  children,
}: PropsWithChildren) => {
  return (
    <QueryClientProvider client={createQueryClient()}>
      <OverlayProvider>
        <NotificationProvider>
          <AuthProvider>{children}</AuthProvider>
        </NotificationProvider>
      </OverlayProvider>
    </QueryClientProvider>
  );
};

//a custom render call that nests components inside our App Providers
export const renderWithProviders = (
  ui: React.ReactNode,
  options?: RenderOptions
) => render(ui, { ...options, wrapper: TestProviderWrapper });

export const renderWithProvidersAndOverlays = {};

export const createQueryClient = (): QueryClient => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return queryClient;
};

export const getQueryClient = (): QueryClient =>
  queryClient ?? createQueryClient();
