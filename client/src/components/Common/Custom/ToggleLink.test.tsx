import { describe, expect, test } from 'vitest';
import ToggleLink from './ToggleLink';
import { JSX } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';

const TEST_URL: string = 'https://test.com';
const TEST_LINK_CONTENT_TEXT: string = 'Test Content';
const TEST_LINK_CONTENT: JSX.Element = <span>{TEST_LINK_CONTENT_TEXT}</span>;

describe('ToggleLink Component', () => {
  test('if link provided and enabled is true, children are rendered as a Link', () => {
    renderWithProviders(
      <ToggleLink to={TEST_URL} enabled={true}>
        {TEST_LINK_CONTENT}
      </ToggleLink>
    );
    expect(screen.getByRole('link')).toHaveTextContent(TEST_LINK_CONTENT_TEXT);
  });
  test('if link provided but enabled is false, children are rendered without a Link', () => {
    renderWithProviders(
      <ToggleLink to={TEST_URL} enabled={false}>
        {TEST_LINK_CONTENT}
      </ToggleLink>
    );
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(TEST_LINK_CONTENT_TEXT)).toBeVisible();
  });
});
