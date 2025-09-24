import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { AuthContext, AuthContextValues } from '../context/AuthProvider';
import { NotificationProvider } from '../context/NotificationProvider';
import { render, RenderOptions } from '@testing-library/react';
import OverlayProvider from '../context/OverlayProvider';
import { UserSessionData } from '../../../shared/types/models';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ImageOverlay from '../components/Overlay/ImageOverlay';
import SignUpOverlay from '../components/Overlay/SignUpOverlay';
import { AnimationProvider } from '../context/AnimationProvider';

export const MOCK_LOGGED_USER_ID: number = 1;
export const MOCK_LOGGED_SESSION_ID: number = 1;
export const MOCK_LOGGED_USERNAME = 'Valid Username';
export const MOCK_LOGGED_TOKEN = 'abc123';
export const MOCK_CREATED_AT: Date = new Date();
export const MOCK_UPDATED_AT: Date = new Date();

export const MOCK_SESSION_VALID: UserSessionData = {
  id: MOCK_LOGGED_SESSION_ID,
  userId: MOCK_LOGGED_USER_ID,
  username: MOCK_LOGGED_USERNAME,
  token: MOCK_LOGGED_TOKEN,
  updatedAt: MOCK_UPDATED_AT,
  createdAt: MOCK_CREATED_AT,
  expired: false,
};

export const MOCK_SESSION_EXPIRED: UserSessionData = {
  id: MOCK_LOGGED_SESSION_ID,
  userId: MOCK_LOGGED_USER_ID,
  username: MOCK_LOGGED_USERNAME,
  token: MOCK_LOGGED_TOKEN,
  updatedAt: MOCK_UPDATED_AT,
  createdAt: MOCK_CREATED_AT,
  expired: false,
};

export const MOCK_AUTH_VALID: AuthContextValues = {
  session: MOCK_SESSION_VALID,
  login: vi.fn(),
  logout: vi.fn(),
  isLoginPending: false,
};

export const MOCK_AUTH_LOADING: AuthContextValues = {
  session: MOCK_SESSION_VALID,
  login: vi.fn(),
  logout: vi.fn(),
  isLoginPending: true,
};

export const MOCK_AUTH_EMPTY: AuthContextValues = {
  session: null,
  login: vi.fn(),
  logout: vi.fn(),
  isLoginPending: false,
};

interface TestProviderWrapperProps extends PropsWithChildren {
  loggedIn?: boolean;
}

//a custom wrapper for components that require the Provider chain
export const TestProviderWrapper = ({
  children,
  loggedIn,
}: TestProviderWrapperProps) => {
  return (
    //a memory router for testing
    <MemoryRouter>
      <AnimationProvider>
        <QueryClientProvider client={createQueryClient()}>
          <NotificationProvider>
            <OverlayProvider>
              <AuthContext.Provider
                value={loggedIn ? MOCK_AUTH_VALID : MOCK_AUTH_EMPTY}
              >
                <ImageOverlay />
                <SignUpOverlay />
                {children}
              </AuthContext.Provider>
            </OverlayProvider>
          </NotificationProvider>
        </QueryClientProvider>
      </AnimationProvider>
    </MemoryRouter>
  );
};

interface CustomRenderOptions extends RenderOptions {
  loggedIn: boolean;
}

//a custom render call that nests components inside our App Providers
export const renderWithProviders = (
  ui: React.ReactNode,
  options?: CustomRenderOptions
) => {
  render(ui, {
    ...options,
    wrapper: ({ children }) =>
      TestProviderWrapper({ children, loggedIn: options?.loggedIn }),
  });
};

export const createQueryClient = (): QueryClient => {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return queryClient;
};
