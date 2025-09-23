import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import HeaderLogin from './HeaderLogin';
import AuthProvider from '../../context/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '../../test/test-utils';
import { NotificationProvider } from '../../context/NotificationProvider';

describe('Header Login', () => {
  test('Sign up button renders (Logged out)', () => {
    render(
      <QueryClientProvider client={getQueryClient()}>
        <NotificationProvider>
          <AuthProvider>
            <HeaderLogin />
          </AuthProvider>
        </NotificationProvider>
      </QueryClientProvider>
    );
    expect(screen.getByRole('button', { name: /sign up/i })).toBeVisible();
  });
  //test('Sign up opens Overlay', () => {});
});
