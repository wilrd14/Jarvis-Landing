import { expect, test } from '@playwright/test';

// RNF-06: sin peticiones a terceros, sin cookies, sin almacenamiento local.
test.describe('privacidad', () => {
  test('todas las peticiones van al mismo origen y no hay cookies ni almacenamiento', async ({
    page,
    context,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const requested: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.startsWith('data:') || url.startsWith('blob:')) return;
      requested.push(url);
    });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    // Recorre la página para activar contenido diferido (fuentes, scripts por scroll).
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    await page.waitForLoadState('networkidle');

    expect(requested.length).toBeGreaterThan(0);
    const external = requested.filter((u) => new URL(u).origin !== origin);
    expect(external, 'peticiones fuera del mismo origen').toEqual([]);

    expect(await context.cookies(), 'cookies del contexto').toEqual([]);
    const cookieString = await page.evaluate(() => document.cookie);
    expect(cookieString).toBe('');
    const storage = await page.evaluate(() => ({
      local: window.localStorage.length,
      session: window.sessionStorage.length,
    }));
    expect(storage).toEqual({ local: 0, session: 0 });
  });

  test('ninguna respuesta del mismo origen intenta fijar cookies', async ({ page }) => {
    const setCookies: string[] = [];
    page.on('response', async (response) => {
      const header = await response.headerValue('set-cookie');
      if (header) setCookies.push(`${response.url()} -> ${header}`);
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(setCookies).toEqual([]);
  });
});
