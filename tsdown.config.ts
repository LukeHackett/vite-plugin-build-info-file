import { defineConfig } from 'tsdown';

// eslint-disable-next-line import-x/no-default-export
export default defineConfig({
  // Keep the exports.default shape that consumers of the tsup build relied on
  cjsDefault: false,
  clean: true,
  deps: {
    neverBundle: true,
  },
  dts: true,
  entry: ['src/index.ts'],
  // Keep .js/.d.ts for ESM (rather than .mjs/.d.mts) to match the package.json exports map
  fixedExtension: false,
  format: ['cjs', 'esm'],
  target: false,
});
