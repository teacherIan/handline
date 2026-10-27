/**
 * Bundles for people who can't import the TypeScript source:
 *   dist/handline.js       ESM, React bindings included, react left external
 *   dist/handline.iife.js  no React, a `Handline` global, for a plain <script>
 */
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/handline.js',
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  external: ['react', 'react/jsx-runtime'],
  jsx: 'automatic',
});
await build({
  entryPoints: ['src/vanilla.ts'],
  outfile: 'dist/handline.iife.js',
  bundle: true,
  format: 'iife',
  globalName: 'Handline',
  minify: true,
  target: 'es2020',
});
console.log('dist/handline.js, dist/handline.iife.js');
