import { screen } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import HeaderLogin from './HeaderLogin';
import { renderWithProviders } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';

const getSignUpButton = (): HTMLElement =>
  screen.getByRole('button', { name: /sign up/i });
const getCreateButton = (): HTMLElement =>
  screen.getByRole('button', { name: /create/i });

describe('Header Login', () => {
  describe('If logged out', () => {
    beforeEach(() => renderWithProviders(<HeaderLogin />));
    test('Sign up button renders', () => {
      expect(getSignUpButton()).toBeVisible();
    });
    test('When clicked, Sign up Overlay opens', async () => {
      await userEvent.click(getSignUpButton());
      expect(getCreateButton()).toBeVisible();
    });
  });
});
