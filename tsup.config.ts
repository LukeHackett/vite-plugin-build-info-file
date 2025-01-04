import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  clean: true,
  dts: true,
  format: ['esm'],
  target: 'es2020',
});
