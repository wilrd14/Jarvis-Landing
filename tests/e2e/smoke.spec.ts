import { expect, test } from '@playwright/test';
import { trackRequests } from './helpers/same-origin';

test('la portada carga con un solo h1 y lang="es"', async ({ page, baseURL }) => {
  const assertSameOrigin = trackRequests(page, baseURL);
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.waitForLoadState('networkidle');
  assertSameOrigin();
});
