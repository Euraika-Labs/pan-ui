#!/usr/bin/env node

/**
 * Post-build packaging script for npm publish.
 *
 * Next.js standalone output doesn't include `public/` or `.next/static/`
 * by default — they need to be copied into the standalone directory
 * so the package is self-contained.
 */

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const standalone = join(root, '.next', 'standalone');

if (!existsSync(standalone)) {
  console.error('✗ No standalone build found. Run `npm run build` first.');
  process.exit(1);
}

// Copy public/ into standalone
const publicSrc = join(root, 'public');
const publicDest = join(standalone, 'public');
if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
  console.log('✓ Copied public/ → .next/standalone/public/');
}

// Copy .next/static into standalone/.next/static
const staticSrc = join(root, '.next', 'static');
const staticDest = join(standalone, '.next', 'static');
if (existsSync(staticSrc)) {
  mkdirSync(join(standalone, '.next'), { recursive: true });
  cpSync(staticSrc, staticDest, { recursive: true });
  console.log('✓ Copied .next/static/ → .next/standalone/.next/static/');
}

console.log('✓ Package ready for npm publish');
