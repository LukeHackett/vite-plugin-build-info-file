import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  skipNodeModulesBundle: true,
});
