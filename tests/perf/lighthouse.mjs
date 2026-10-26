/* eslint-disable no-console -- scripts de CLI que informan por consola */
// Lighthouse móvil (RNF-01) contra `astro preview`. Requiere "npm run build" previo.
// Lighthouse se descarga bajo demanda con npx (no es dependencia del proyecto).
// Uso: node tests/perf/lighthouse.mjs   (o npm run perf)
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const PORT = 4323;
const URL_ = `http://127.0.0.1:${PORT}/`;
const shell = process.platform === 'win32';
const preview = spawn(
  'npm',
  ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT)],
  { shell, stdio: 'ignore' },
);
const stop = () => {
  if (shell) spawnSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  else preview.kill();
};

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL_)).ok) break;
    } catch {
      /* servidor aún no listo */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  const out = join(mkdtempSync(join(tmpdir(), 'lh-')), 'report.json');
  const run = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse@13',
      URL_,
      '--output=json',
      `--output-path=${out}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
    ],
    { shell, stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() } },
  );
  if (run.status !== 0) throw new Error('Lighthouse falló');
  const lhr = JSON.parse(readFileSync(out, 'utf8'));
  let low = false;
  for (const c of Object.values(lhr.categories)) {
    const score = Math.round(c.score * 100);
    if (score < 95) low = true;
    console.log(`${c.title.padEnd(16)} ${score}${score < 95 ? '  <-- por debajo de 95' : ''}`);
  }
  const a = lhr.audits;
  const lcp = a['largest-contentful-paint'].numericValue;
  const cls = a['cumulative-layout-shift'].numericValue;
  const tbt = a['total-blocking-time'].numericValue;
  console.log(
    `LCP ${(lcp / 1000).toFixed(2)} s (objetivo < 2,5)${lcp >= 2500 ? ' <-- FALLA' : ''}`,
  );
  console.log(`CLS ${cls.toFixed(3)} (objetivo < 0,05)${cls >= 0.05 ? ' <-- FALLA' : ''}`);
  console.log(`TBT ${Math.round(tbt)} ms (objetivo < 200)${tbt >= 200 ? ' <-- FALLA' : ''}`);
  process.exitCode = low || lcp >= 2500 || cls >= 0.05 || tbt >= 200 ? 1 : 0;
} finally {
  stop();
}
