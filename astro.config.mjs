// @ts-check
import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL definitiva por defecto; PUBLIC_SITE_URL permite sobreescribirla (p. ej. en previews).
const site = process.env.PUBLIC_SITE_URL ?? 'https://jarvis.wilrd14.dev';

/** Añade a dist/robots.txt la línea Sitemap con la URL real (robots.txt exige URL absoluta). */
const robotsSitemap = {
  name: 'robots-sitemap',
  hooks: {
    /** @param {{ dir: URL }} options */
    'astro:build:done': ({ dir }) => {
      const robots = fileURLToPath(new URL('robots.txt', dir));
      appendFileSync(robots, `\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`);
    },
  },
};

const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

/**
 * Sustituye en dist/_headers el marcador de la CSP por los hashes SHA-256 de los scripts
 * inline de index.html (Astro los inyecta y su contenido cambia con cada build).
 */
const cspHashes = {
  name: 'csp-hashes',
  hooks: {
    /** @param {{ dir: URL }} options */
    'astro:build:done': ({ dir }) => {
      const html = readFileSync(fileURLToPath(new URL('index.html', dir)), 'utf8');
      const hashes = [...html.matchAll(INLINE_SCRIPT)].map(
        (match) =>
          `'sha256-${createHash('sha256')
            .update(match[1] ?? '')
            .digest('base64')}'`,
      );
      const file = fileURLToPath(new URL('_headers', dir));
      writeFileSync(
        file,
        readFileSync(file, 'utf8').replace('{{SCRIPT_HASHES}}', hashes.join(' ')),
      );
    },
  },
};

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap(), robotsSitemap, cspHashes],
  vite: {
    plugins: [tailwindcss()],
  },
});
