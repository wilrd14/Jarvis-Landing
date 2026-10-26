import { expect, test, type Page } from '@playwright/test';

/**
 * RF-10: botón «Copiar». Los permisos de portapapeles solo se pueden conceder en Chromium,
 * así que en todos los navegadores se sustituye navigator.clipboard por un doble controlado.
 */

type Mode = 'ok' | 'reject' | 'none';

async function stubClipboard(page: Page, mode: Mode) {
  await page.addInitScript((m) => {
    const w = window as unknown as { __copied: string[] };
    w.__copied = [];
    if (m === 'none') {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
      return;
    }
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (t: string) =>
          m === 'ok'
            ? (w.__copied.push(t), Promise.resolve())
            : Promise.reject(new DOMException('denied', 'NotAllowedError')),
      },
    });
  }, mode);
}

const copied = (page: Page) =>
  page.evaluate(() => (window as unknown as { __copied: string[] }).__copied);
const block = (page: Page) => page.locator('#instalacion [data-codeblock]').first();
const ERROR_TEXT = 'No se pudo copiar. Selecciona el texto.';

test('copia el comando, anuncia «Copiado» y vuelve a «Copiar»', async ({ page }) => {
  await stubClipboard(page, 'ok');
  await page.goto('/');
  const b = block(page);
  const button = b.getByRole('button', { name: 'Copiar comando' });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(button).toContainText('Copiado');
  await expect(b.locator('[data-copy-status]')).toHaveText('Copiado');
  await expect(b.locator('[data-copy-status]')).toHaveAttribute('aria-live', 'polite');
  expect(await copied(page)).toEqual(['npm install']);
  await expect(button).not.toContainText('Copiado', { timeout: 4500 });
  await expect(button).toContainText('Copiar');
});

test('se puede copiar solo con teclado (foco en el botón + Enter)', async ({ page }) => {
  await stubClipboard(page, 'ok');
  await page.goto('/');
  const button = block(page).getByRole('button', { name: 'Copiar comando' });
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(button).toContainText('Copiado');
  expect(await copied(page)).toHaveLength(1);
});

test('cada bloque copia su propio comando', async ({ page }) => {
  await stubClipboard(page, 'ok');
  await page.goto('/');
  const blocks = page.locator('#instalacion [data-codeblock]');
  const n = await blocks.count();
  expect(n).toBeGreaterThanOrEqual(3);
  const expected: string[] = [];
  for (let i = 0; i < n; i++) {
    expected.push(((await blocks.nth(i).locator('[data-copy-source]').textContent()) ?? '').trim());
    await blocks.nth(i).getByRole('button', { name: 'Copiar comando' }).click();
  }
  expect(await copied(page)).toEqual(expected);
  expect(expected).toContain('npm run app:install');
});

test('con el portapapeles denegado muestra el error y deja el texto seleccionado', async ({
  page,
}) => {
  await stubClipboard(page, 'reject');
  await page.goto('/');
  const b = block(page);
  const button = b.getByRole('button', { name: 'Copiar comando' });
  await button.click();
  const status = b.locator('[data-copy-status]');
  await expect(status).toHaveText(ERROR_TEXT);
  await expect(status).toBeVisible();
  await expect(button).not.toContainText('Copiado');
  expect(await page.evaluate(() => window.getSelection()?.toString().trim())).toBe('npm install');
});

test('sin la API de portapapeles también muestra el error', async ({ page }) => {
  await stubClipboard(page, 'none');
  await page.goto('/');
  const b = block(page);
  await b.getByRole('button', { name: 'Copiar comando' }).click();
  await expect(b.locator('[data-copy-status]')).toHaveText(ERROR_TEXT);
});

test('tras un error, un reintento correcto limpia el mensaje', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => (++calls === 1 ? Promise.reject(new Error('denied')) : Promise.resolve()) },
    });
  });
  await page.goto('/');
  const b = block(page);
  const button = b.getByRole('button', { name: 'Copiar comando' });
  await button.click();
  await expect(b.locator('[data-copy-status]')).toContainText('No se pudo copiar');
  await button.click();
  await expect(button).toContainText('Copiado');
  await expect(b.locator('[data-copy-status]')).toHaveText('Copiado');
});

test('clics repetidos no dejan el botón atascado en «Copiado»', async ({ page }) => {
  await stubClipboard(page, 'ok');
  await page.goto('/');
  const button = block(page).getByRole('button', { name: 'Copiar comando' });
  await button.click();
  await button.click();
  await button.click();
  await expect(button).toContainText('Copiado');
  await expect(button).not.toContainText('Copiado', { timeout: 4500 });
});

test('sin JavaScript el botón no se muestra y el comando sigue visible', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  const b = block(page);
  await expect(b.locator('[data-copy-source]')).toBeVisible();
  await expect(b.locator('[data-copy]')).toBeHidden();
  await context.close();
});
