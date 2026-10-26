import { expect, test, type Page } from '@playwright/test';

const MOBILE = { width: 375, height: 667 };
const DESKTOP = { width: 1280, height: 800 };
const NAV_NAMES = ['Capacidades', 'Seguridad', 'Costes', 'Instalación', 'FAQ'];

const toggle = (page: Page) => page.locator('[data-nav-toggle]');
const panel = (page: Page) => page.locator('[data-nav-panel]');

test.describe('RF-12 menú móvil (< 768 px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');
    await expect(toggle(page)).toBeVisible();
  });

  test('empieza cerrado, con el panel oculto', async ({ page }) => {
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle(page)).toHaveAccessibleName('Abrir menú');
    await expect(panel(page)).toBeHidden();
  });

  test('se abre y cierra con Enter y cambia el nombre accesible', async ({ page }) => {
    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle(page)).toHaveAccessibleName('Cerrar menú');
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(panel(page)).toBeHidden();
  });

  test('se abre con Espacio', async ({ page }) => {
    await toggle(page).focus();
    await page.keyboard.press('Space');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
  });

  test('Esc cierra el menú y devuelve el foco al botón', async ({ page }) => {
    await toggle(page).focus();
    await page.keyboard.press('Enter');
    // Foco explícito (WebKit no lleva los enlaces en el orden de Tab por defecto).
    await panel(page).getByRole('link', { name: 'Seguridad' }).focus();
    await page.keyboard.press('Escape');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle(page)).toBeFocused();
  });

  test('Esc con el menú cerrado no lo abre ni mueve el foco', async ({ page }) => {
    await toggle(page).focus();
    await page.keyboard.press('Escape');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle(page)).toBeFocused();
  });

  test('pulsar un enlace del panel navega a la sección y cierra el menú', async ({ page }) => {
    await toggle(page).click();
    await panel(page).getByRole('link', { name: 'Seguridad' }).click();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#seguridad$/);
    await expect(page.locator('#seguridad')).toBeInViewport();
  });

  test('el panel contiene los enlaces de navegación y el CTA a GitHub', async ({ page }) => {
    await toggle(page).click();
    for (const name of NAV_NAMES) {
      await expect(panel(page).getByRole('link', { name, exact: true })).toBeVisible();
    }
    await expect(panel(page).getByRole('link', { name: 'Ver en GitHub' })).toBeVisible();
  });

  test('al pasar a escritorio con el menú abierto, los enlaces siguen visibles y el botón desaparece', async ({
    page,
  }) => {
    await toggle(page).click();
    await page.setViewportSize(DESKTOP);
    await expect(toggle(page)).toBeHidden();
    await expect(panel(page).getByRole('link', { name: 'Costes', exact: true })).toBeVisible();
  });
});

test.describe('RF-12 escritorio', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
  });

  test('no hay botón de menú y los enlaces son visibles', async ({ page }) => {
    await expect(toggle(page)).toBeHidden();
    const nav = page.getByRole('navigation', { name: 'Principal' });
    for (const name of NAV_NAMES) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test('la cabecera es fija: sigue visible tras hacer scroll', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await expect(page.getByRole('banner')).toBeInViewport();
    await expect(page.getByRole('banner')).toHaveAttribute('data-scrolled', '');
  });

  test('el enlace del logotipo vuelve al inicio', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: 'Jarvis, ir al inicio' }).click();
    await expect(page).toHaveURL(/#inicio$/);
  });

  test('los enlaces de navegación apuntan a anclas existentes', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Principal' });
    const expected: Record<string, string> = {
      Capacidades: '#voz',
      Seguridad: '#seguridad',
      Costes: '#costes',
      Instalación: '#instalacion',
      FAQ: '#faq',
    };
    for (const [name, href] of Object.entries(expected)) {
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test('resalta la sección activa (aria-current) al hacer scroll', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Principal' });
    const cases: [string, string][] = [
      ['#seguridad', 'Seguridad'],
      ['#costes', 'Costes'],
      ['#instalacion', 'Instalación'],
      ['#faq', 'FAQ'],
      ['#acciones', 'Capacidades'], // «Capacidades» agrupa varias secciones
    ];
    for (const [id, name] of cases) {
      await page.locator(id).evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await expect(
        nav.getByRole('link', { name, exact: true }),
        `${id} -> ${name}`,
      ).toHaveAttribute('aria-current', 'true');
      await expect(nav.locator('[aria-current="true"]')).toHaveCount(1);
    }
  });

  test('en el inicio no hay ningún enlace resaltado', async ({ page }) => {
    await expect(page.locator('[data-nav-link][aria-current="true"]')).toHaveCount(0);
  });
});
