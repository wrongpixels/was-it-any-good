import { screen, within } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import HeaderLogin from './HeaderLogin';
import {
  MOCK_LOGGED_USERNAME,
  renderWithProviders,
} from '../../test/test-utils';
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
const queryUserField = (): HTMLElement | null =>
  screen.queryByPlaceholderText('User');
const queryPasswordField = (): HTMLElement | null =>
  screen.queryByPlaceholderText('Password');
const getUserField = (): HTMLElement => screen.getByPlaceholderText('User');
const getPasswordField = (): HTMLElement =>
  screen.getByPlaceholderText('Password');
const getSignUpButton = (): HTMLElement =>
  screen.getByRole('button', { name: /sign up/i });
const getCreateButton = (): HTMLElement =>
  screen.getByRole('button', { name: /create/i });

describe('Header Login', () => {
  describe('If logged out', () => {
    beforeEach(() => renderWithProviders(<HeaderLogin />));

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
    test('Log Out button does not render', () => {
      expect(queryLogOutButton()).toBeNull();
    });
    test('User profile data does not render', () => {
      expect(
        screen.queryByRole('link', {
          name: `View profile for ${MOCK_LOGGED_USERNAME}`,
        })
      ).toBeNull();
    });
    describe('when logging in fails', () => {
      test('shows a notification if both fields are empty', async () => {
        await userEvent.click(getLoginButton());
        expect(screen.getByRole('alert')).toHaveTextContent(
          NOTI_MISSING_USER_AND_PASSWORD
        );
      });

      test('shows a notification if only the password is provided', async () => {
        await userEvent.type(getPasswordField(), TEST_PASSWORD);
        await userEvent.click(getLoginButton());
        expect(screen.getByRole('alert')).toHaveTextContent(
          getMissingUserOrPasswordMessage('')
        );
      });

      test('shows a notification if only the user is provided', async () => {
        await userEvent.type(getUserField(), TEST_USER);
        await userEvent.click(getLoginButton());
        expect(screen.getByRole('alert')).toHaveTextContent(
          getMissingUserOrPasswordMessage(TEST_USER)
        );
      });
    });
    test('Sign Up button renders', () => {
      expect(querySignUpButton()).toBeVisible();
    });
    test('When clicked, Sign up Overlay opens', async () => {
      await userEvent.click(getSignUpButton());
      expect(getCreateButton()).toBeVisible();
    });
  });
  describe('If Logged in', () => {
    beforeEach(() => {
      renderWithProviders(<HeaderLogin />, { loggedIn: true });
    });
    9;
    describe('User profile data', () => {
      test('data renders', () => {
        expect(
          screen.getByRole('link', {
            name: `View profile for ${MOCK_LOGGED_USERNAME}`,
          })
        ).toBeVisible();
      });
      test('avatar renders', () => {
        const profile: HTMLElement = screen.getByRole('link', {
          name: `View profile for ${MOCK_LOGGED_USERNAME}`,
        });
        const avatar: HTMLElement = within(profile).getByRole('img');
        expect(avatar).toBeVisible();
      });
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
