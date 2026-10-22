import { build } from 'esbuild';

const watch = process.argv.includes('--watch');

/** Shared flags for both bundles. */
const shared = {
  entryPoints: ['src/panel/main.ts'],
  bundle: true,
  target: 'es2022',
  loader: { '.css': 'text' },
  logLevel: 'info',
};

/** Panel: sandboxed iframe, cannot load ESM, so a browser IIFE (same rule as
 *  the host's own guest bundler). */
const railPanel = {
  ...shared,
  format: 'iife',
  platform: 'browser',
  minify: true,
  define: { IS_SECTION: 'false' },
  outfile: 'panel/main.js',
};

/** Work Status section: a second bundle from the same source with the relay
 *  management compiled out, so the section can never show the add form. */
const statusSection = {
  ...shared,
  format: 'iife',
  platform: 'browser',
  minify: true,
  define: { IS_SECTION: 'true' },
  outfile: 'panel/section.js',
};

/** Service: runs under Node, so ESM with Node built-ins external. */
const service = {
  entryPoints: ['src/service/main.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  packages: 'external',
  outfile: 'service/main.js',
  logLevel: 'info',
};

if (watch) {
  const { context } = await import('esbuild');
  const contexts = await Promise.all([context(railPanel), context(statusSection), context(service)]);
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  console.log('watching…');
} else {
  await Promise.all([build(railPanel), build(statusSection), build(service)]);
  console.log('built panel/main.js, panel/section.js and service/main.js');
}
