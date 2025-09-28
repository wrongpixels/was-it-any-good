import { describe, expect, test, vi } from 'vitest';
import {
  Anim,
  AnimationContext,
  AnimEngineValues,
  AnimKey,
} from '../../../context/AnimationProvider';
import { render, screen } from '@testing-library/react';
import { JSX } from 'react';
import { AnimatedDiv } from './AnimatedDiv';

const ANIM_KEY: AnimKey = 'test-div';
const ANIM_CLASSNAME: string = 'shake';
const TEST_CONTENT: string = 'Test';

const ACTIVE_MAP: Map<AnimKey, Anim> = new Map([
  [ANIM_KEY, { animationClass: ANIM_CLASSNAME, loop: false }],
]);
const EMPTY_PROVIDER: AnimEngineValues = {
  activeAnimations: new Map(),
  playAnim: vi.fn(),
  stopAnim: vi.fn(),
};

const ACTIVE_PROVIDER: AnimEngineValues = {
  activeAnimations: ACTIVE_MAP,
  playAnim: vi.fn(),
  stopAnim: vi.fn(),
};

const getTestDiv = (activeAnim: boolean): JSX.Element => (
  <AnimationContext.Provider
    value={!activeAnim ? EMPTY_PROVIDER : ACTIVE_PROVIDER}
  >
    <AnimatedDiv animKey={ANIM_KEY}>{TEST_CONTENT}</AnimatedDiv>
  </AnimationContext.Provider>
);

describe('AnimatedDiv Component', () => {
  test('if no animation set, div renders normally', () => {
    render(getTestDiv(false));
    const testDiv: HTMLElement = screen.getByText(TEST_CONTENT);
    expect(testDiv).not.toHaveClass(ANIM_CLASSNAME);
  });
  test('if animation set, div renders with animation className', () => {
    render(getTestDiv(true));
    const testDiv: HTMLElement = screen.getByText(TEST_CONTENT);
    expect(testDiv).toHaveClass(ANIM_CLASSNAME);
  });
});
