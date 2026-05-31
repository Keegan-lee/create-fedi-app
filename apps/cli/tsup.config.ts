import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  shims: true,
  // Required so npx/npm can execute the bin (otherwise the shell runs the bundle as sh)
  banner: {
    js: '#!/usr/bin/env node',
  },
  noExternal: [/@clack/, /fs-extra/, /execa/, /picocolors/, /semver/],
});
