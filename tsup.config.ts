import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  clean: true,
  dts: true,
  external: ['vite'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  splitting: false,
  target: 'node16',
});
