/**
 * Runs the tests with Node's own test runner — no test framework. esbuild
 * bundles each *.test.ts so the source's extensionless imports resolve, then
 * `node --test` runs the bundles.
 */
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/__tests__');
const files = readdirSync(dir).filter((f) => f.endsWith('.test.ts'));
const out = mkdtempSync(join(tmpdir(), 'handline-tests-'));

try {
  await build({
    entryPoints: files.map((f) => join(dir, f)),
    outdir: out,
    bundle: true,
    platform: 'node',
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    logLevel: 'warning',
  });
  const bundles = files.map((f) => join(out, f.replace(/\.ts$/, '.mjs')));
  const run = spawnSync(process.execPath, ['--test', ...bundles], { stdio: 'inherit' });
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(out, { recursive: true, force: true });
}
