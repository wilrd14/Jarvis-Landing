/* eslint-disable no-console -- scripts de CLI que informan por consola */
// Presupuesto de JavaScript (RNF-02): JS total de dist/ en gzip <= 60 KB.
// Cuenta los archivos .js/.mjs y los <script> en línea de los .html (los scripts
// de cliente de Astro salen inline). Uso: node tests/perf/budget.mjs [ruta-dist]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 60;
const dist = resolve(process.argv[2] ?? 'dist');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

try {
  statSync(dist);
} catch {
  console.error(`No existe ${dist}. Ejecuta "npm run build" antes.`);
  process.exit(2);
}

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const rows = [];
for (const file of walk(dist)) {
  const rel = relative(dist, file).split(sep).join('/');
  if (/\.(m?js)$/.test(file)) {
    rows.push({ origin: rel, bytes: gz(readFileSync(file)) });
  } else if (file.endsWith('.html')) {
    const html = readFileSync(file, 'utf8');
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    let i = 0;
    while ((m = re.exec(html))) {
      const attrs = m[1];
      if (/type\s*=\s*["']?(application\/ld\+json|application\/json|importmap)/i.test(attrs))
        continue;
      if (m[2].trim())
        rows.push({ origin: `${rel} <script> en línea #${++i}`, bytes: gz(Buffer.from(m[2])) });
    }
  }
}

const total = rows.reduce((s, r) => s + r.bytes, 0);
for (const r of rows) console.log(`${(r.bytes / 1024).toFixed(2).padStart(8)} KB gz  ${r.origin}`);
console.log(`\nTotal JS: ${(total / 1024).toFixed(2)} KB gzip (presupuesto ${BUDGET_KB} KB)`);
if (total > BUDGET_KB * 1024) {
  console.error('FALLA: se supera el presupuesto de JavaScript.');
  process.exit(1);
}
console.log('OK');
