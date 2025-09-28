import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import DisabledDiv from './DisabledDiv';

const TEST_CONTENT: string = 'Test span';

describe('DisabledDiv Component', () => {
  test('if disabled is false, children are visible and interactive', () => {
    render(<DisabledDiv disabled={false}>{TEST_CONTENT}</DisabledDiv>);
    const divElement: HTMLElement = screen.getByText(TEST_CONTENT);
    expect(divElement).toBeVisible();
    expect(divElement).not.toHaveClass('pointer-events-none');
  });
  test('if disabled is true, children are also visible but disabled', () => {
    render(<DisabledDiv disabled={true}>{TEST_CONTENT}</DisabledDiv>);
    const divElement: HTMLElement = screen.getByText(TEST_CONTENT);
    expect(divElement).toBeVisible();
    expect(divElement).toHaveClass('pointer-events-none');
  });
});
