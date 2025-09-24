import { screen } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import HeaderLogin from './HeaderLogin';
import { renderWithProviders } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import {
  getMissingUserOrPasswordMessage,
  NOTI_MISSING_USER_AND_PASSWORD,
} from '../../../../shared/constants/notification-messages';

const TEST_USER: string = 'Test User';
const TEST_PASSWORD: string = 'Test Password';

const querySignUpButton = (): HTMLElement | null =>
  screen.queryByRole('button', { name: /sign up/i });
const queryLoginButton = (): HTMLElement | null =>
  screen.queryByRole('button', { name: /log in/i });
const getLoginButton = (): HTMLElement =>
  screen.getByRole('button', { name: /log in/i });
const queryLogOutButton = (): HTMLElement | null =>
  screen.queryByRole('button', { name: /log out/i });

const getUserField = (): HTMLElement => screen.getByPlaceholderText('User');
const getPasswordField = (): HTMLElement =>
  screen.getByPlaceholderText('Password');

const queryUserField = (): HTMLElement | null =>
  screen.queryByPlaceholderText('User');
const queryPasswordField = (): HTMLElement | null =>
  screen.queryByPlaceholderText('Password');

describe('Header Login', () => {
  describe('If logged out', () => {
    beforeEach(() => renderWithProviders(<HeaderLogin />));
    test('Sign Up button renders', () => {
      expect(querySignUpButton()).toBeVisible();
    });
    test('Log In Form renders and correctly follows user inputs', async () => {
      expect(queryLoginButton()).toBeVisible();
      const userField: HTMLElement = getUserField();
      const passwordField: HTMLElement = getPasswordField();
      expect(userField).toBeVisible();
      expect(passwordField).toBeVisible();
      await userEvent.type(userField, TEST_USER);
      await userEvent.type(passwordField, TEST_PASSWORD);
      expect(userField).toHaveValue(TEST_USER);
      expect(passwordField).toHaveValue(TEST_PASSWORD);
    });
    test('Log Out button does not render', () =>
      expect(queryLogOutButton()).toBeNull());
    test('Log In fails with empty data', async () => {
      const userField: HTMLElement = getUserField();
      const passwordField: HTMLElement = getPasswordField();
      const loginButton: HTMLElement = getLoginButton();

      await userEvent.click(loginButton);
      expect(screen.getByText(NOTI_MISSING_USER_AND_PASSWORD)).toBeVisible();

      await userEvent.type(userField, TEST_USER);
      await userEvent.click(loginButton);
      expect(
        screen.getByText(getMissingUserOrPasswordMessage(TEST_USER))
      ).toBeVisible();

      await userEvent.clear(userField);
      await userEvent.type(passwordField, TEST_PASSWORD);
      await userEvent.click(loginButton);
      expect(
        screen.getByText(getMissingUserOrPasswordMessage(''))
      ).toBeVisible();
    });
    /*
    test('When clicked, Sign up Overlay opens', async () => {
      await userEvent.click(getSignUpButton());
      expect(getCreateButton()).toBeVisible();
    });*/
  });
  describe('If Logged in', () => {
    beforeEach(() => {
      renderWithProviders(<HeaderLogin />, { loggedIn: true });
    });
    test('Log Out button is visible', () => {
      expect(queryLogOutButton()).toBeVisible();
    });

    test('Login form does not render', () => {
      expect(queryUserField()).toBeNull();
      expect(queryPasswordField()).toBeNull();
      expect(queryLoginButton()).toBeNull();
    });
  });
});
