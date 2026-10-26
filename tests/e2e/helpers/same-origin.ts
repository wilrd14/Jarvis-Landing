import { expect, type Page } from '@playwright/test';

/**
 * Registra las peticiones de la página y devuelve una función que falla la prueba
 * si alguna salió del origen de `baseURL` (RNF-03: sin terceros).
 * Se ignoran los esquemas data: y blob:, que no salen a la red.
 * Uso: `const assertSameOrigin = trackRequests(page);` antes de `page.goto`,
 * y `assertSameOrigin()` al final de la prueba.
 */
export function trackRequests(page: Page, baseURL = 'http://localhost:4322'): () => void {
  const origin = new URL(baseURL).origin;
  const external: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('data:') || url.startsWith('blob:')) return;
    if (new URL(url).origin !== origin) external.push(url);
  });
  return () => expect(external, 'peticiones fuera del mismo origen').toEqual([]);
}
