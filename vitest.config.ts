/// <reference types="vitest" />
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, '.lintstagedrc.cjs', '.prettierrc.cjs', 'src/index.ts', 'src/types.ts'],
      provider: 'v8',
      thresholds: {
        100: true,
      },
    },
    mockReset: true,
  },
});
