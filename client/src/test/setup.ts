import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { createQueryClient } from './test-utils';

expect.extend(matchers);

beforeAll(() => createQueryClient());

afterEach(() => {
  cleanup();
});
