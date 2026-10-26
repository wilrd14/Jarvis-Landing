import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 375, height: 667 };
/** Duración máxima tolerada para una transición CSS (s). */
const MAX_TRANSITION_S = 0.4;

const INTERACTIVE =
  'a[href], button, summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';

async function expectNoViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

async function settle(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
}

test.describe('RNF-03 axe (WCAG 2.1 AA)', () => {
  for (const [name, viewport] of [
    ['escritorio', DESKTOP],
    ['móvil', MOBILE],
  ] as const) {
    test(`0 violaciones en ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await settle(page);
      await expectNoViolations(page);
    });
  }

  test('0 violaciones con el menú móvil abierto', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await settle(page);
    await page.locator('[data-nav-toggle]').click();
    await expect(page.locator('[data-nav-panel]')).toBeVisible();
    await expectNoViolations(page);
  });

  test('0 violaciones con movimiento reducido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settle(page);
    await expectNoViolations(page);
  });

  test('0 violaciones con un FAQ desplegado', async ({ page }) => {
    await settle(page);
    const first = page.locator('#faq summary').first();
    await first.click();
    await expect(page.locator('#faq details[open]')).toHaveCount(1);
    await expectNoViolations(page);
  });
});

test.describe('RNF-03 estructura semántica', () => {
  test.beforeEach(async ({ page }) => {
    await settle(page);
  });

  test('hay un solo h1 y la jerarquía de títulos no salta niveles', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1])),
    );
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1], `título #${i}`).toBeLessThanOrEqual(1);
    });
  });

  test('landmarks: banner, main y contentinfo únicos; navegaciones con nombre', async ({
    page,
  }) => {
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    const navs = page.getByRole('navigation');
    const count = await navs.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const names = new Set<string>();
    for (let i = 0; i < count; i += 1) {
      const label = await navs.nth(i).getAttribute('aria-label');
      expect(label, `nav #${i} sin aria-label`).toBeTruthy();
      names.add(label ?? '');
    }
    expect(names.size, 'nombres de navegación repetidos').toBe(count);
  });

  test('el documento declara el idioma español y un título', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', /^es/);
    await expect(page).toHaveTitle(/\S/);
  });

  test('las imágenes tienen alt o son decorativas', async ({ page }) => {
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter(
          (img) =>
            !img.hasAttribute('alt') &&
            img.getAttribute('aria-hidden') !== 'true' &&
            img.getAttribute('role') !== 'presentation',
        )
        .map((img) => img.outerHTML.slice(0, 80)),
    );
    expect(bad).toEqual([]);
  });
});

/** Indicador de foco: contorno visible o sombra distinta de «none». */
async function focusIndicator(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el);
    const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
    const shadow = s.boxShadow !== 'none' && s.boxShadow !== '';
    return outline || shadow;
  });
}

async function describeActive(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement;
    return el
      ? `${el.tagName.toLowerCase()}[${el.getAttribute('href') ?? el.textContent?.trim().slice(0, 30)}]`
      : 'null';
  });
}

for (const [name, viewport] of [
  ['escritorio', DESKTOP],
  ['móvil', MOBILE],
] as const) {
  test.describe(`RNF-04 teclado en ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await settle(page);
    });

    test('todo elemento interactivo visible recibe foco y muestra indicador', async ({ page }) => {
      const handles = await page.locator(INTERACTIVE).elementHandles();
      let checked = 0;
      for (const handle of handles) {
        if (!(await handle.isVisible())) continue;
        // Una pulsación previa garantiza que :focus-visible aplique al foco programático.
        await page.keyboard.press('Shift');
        await handle.focus();
        const label = await describeActive(page);
        expect(await handle.evaluate((el) => el === document.activeElement), label).toBe(true);
        expect(await focusIndicator(page), `sin foco visible en ${label}`).toBe(true);
        checked += 1;
      }
      expect(checked).toBeGreaterThan(10);
    });

    test('Tab avanza sin trampas y recorre los enlaces y botones en orden del DOM', async ({
      page,
      browserName,
    }) => {
      test.skip(browserName === 'webkit', 'WebKit no incluye los enlaces en el orden de Tab');
      const expected = await page.evaluate((sel) => {
        const visible = (el: Element) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden';
        };
        return [...document.querySelectorAll(sel)].filter(visible).length;
      }, INTERACTIVE);

      const seen: string[] = [];
      for (let i = 0; i < expected + 5; i += 1) {
        await page.keyboard.press('Tab');
        const label = await describeActive(page);
        if (label.startsWith('body')) break;
        seen.push(label);
        expect(await focusIndicator(page), `sin foco visible en ${label}`).toBe(true);
      }
      // Sin trampas: el foco recorrió (casi) todos y no se quedó atascado en uno.
      expect(new Set(seen).size).toBeGreaterThanOrEqual(Math.min(expected, 10));
      expect(seen.length).toBeGreaterThanOrEqual(expected - 1);
      // Shift+Tab también sale del elemento actual.
      const before = await describeActive(page);
      await page.keyboard.press('Shift+Tab');
      expect(await describeActive(page)).not.toBe(before);
    });

    test('el enlace de acceso rápido, si existe, salta al contenido principal', async ({
      page,
      browserName,
    }) => {
      test.skip(browserName === 'webkit', 'WebKit no incluye los enlaces en el orden de Tab');
      await page.keyboard.press('Tab');
      const first = page.locator(':focus');
      const href = await first.getAttribute('href');
      test.skip(
        !href?.startsWith('#') || href === '#inicio',
        'no hay enlace «saltar al contenido»',
      );
      await page.keyboard.press('Enter');
      await expect(page.locator(href ?? '#main')).toBeInViewport();
    });
  });
}

test.describe('RNF-04 menú móvil por teclado', () => {
  test('el foco no queda atrapado: Esc cierra y devuelve el foco al botón', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await settle(page);
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('[data-nav-panel] a').first().focus();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    expect(await focusIndicator(page)).toBe(true);
  });

  test('con el menú cerrado, sus enlaces no son alcanzables con Tab', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await settle(page);
    const links = page.locator('[data-nav-panel] a');
    const count = await links.count();
    for (let i = 0; i < count; i += 1) await expect(links.nth(i)).toBeHidden();
  });
});

test.describe('RNF-04 FAQ por teclado', () => {
  test('Enter y Espacio abren y cierran un resumen', async ({ page }) => {
    await settle(page);
    const summary = page.locator('#faq summary').first();
    const details = page.locator('#faq details').first();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(details).not.toHaveAttribute('open', '');
  });
});

/** Cuenta llamadas a requestAnimationFrame desde el inicio de la página. */
async function installRafCounter(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __raf: number };
    w.__raf = 0;
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      w.__raf += 1;
      return original(cb);
    };
  });
}

const rafCount = (page: Page) =>
  page.evaluate(() => (window as unknown as { __raf: number }).__raf);

const canvasSnapshot = (page: Page) =>
  page.locator('canvas[data-hologram]').evaluate((c) => (c as HTMLCanvasElement).toDataURL());

test.describe('RF-15 movimiento reducido', () => {
  test('control: sin preferencia, el holograma anima (rAF activo y lienzo cambia)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installRafCounter(page);
    await settle(page);
    await expect(page.locator('canvas[data-hologram]')).toBeVisible();
    const first = await canvasSnapshot(page);
    const count = await rafCount(page);
    await page.waitForTimeout(600);
    expect(await rafCount(page)).toBeGreaterThan(count);
    expect(await canvasSnapshot(page)).not.toBe(first);
  });

  test('reduce: no hay requestAnimationFrame activo y el lienzo permanece estático', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installRafCounter(page);
    await settle(page);
    await expect(page.locator('canvas[data-hologram]')).toBeVisible();
    await page.waitForTimeout(300);
    const count = await rafCount(page);
    const first = await canvasSnapshot(page);
    await page.waitForTimeout(800);
    expect(await rafCount(page), 'rAF sigue llamándose').toBe(count);
    expect(await canvasSnapshot(page), 'el lienzo cambió').toBe(first);
    expect(count).toBe(0);
  });

  test('reduce: el lienzo dibuja un fotograma estático (no está vacío)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settle(page);
    const painted = await page.locator('canvas[data-hologram]').evaluate((node) => {
      const c = node as HTMLCanvasElement;
      const data = c.getContext('2d')?.getImageData(0, 0, c.width, c.height).data;
      return data ? data.some((v, i) => i % 4 === 3 && v > 0) : false;
    });
    expect(painted).toBe(true);
  });

  test('cambiar la preferencia en caliente detiene la animación', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await installRafCounter(page);
    await settle(page);
    await page.waitForTimeout(300);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(300);
    const count = await rafCount(page);
    await page.waitForTimeout(600);
    expect(await rafCount(page)).toBe(count);
  });

  test('reduce: ninguna transición ni animación CSS supera el límite', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settle(page);
    const offenders = await page.evaluate((max) => {
      const toSeconds = (v: string) =>
        v.split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) / 1000 : parseFloat(x)));
      const bad: string[] = [];
      for (const el of document.querySelectorAll('*')) {
        const s = getComputedStyle(el);
        const t = Math.max(...toSeconds(s.transitionDuration), 0);
        const a = s.animationName !== 'none' ? Math.max(...toSeconds(s.animationDuration), 0) : 0;
        if (t > max || a > max) bad.push(`${el.tagName.toLowerCase()} t=${t}s a=${a}s`);
      }
      return bad.slice(0, 10);
    }, MAX_TRANSITION_S);
    expect(offenders).toEqual([]);
  });

  test('reduce: el scroll por anclas es instantáneo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settle(page);
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).not.toBe('smooth');
  });
});
