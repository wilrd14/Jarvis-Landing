import { expect, test } from '@playwright/test';

const WIDTHS = [320, 375, 768, 1024, 1440] as const;

for (const width of WIDTHS) {
  test.describe(`ancho ${width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 700 : 900 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
    });

    test('RNF-05 no hay scroll horizontal (al cargar y tras recorrer la página con el FAQ abierto)', async ({
      page,
    }) => {
      const overflow = () =>
        page.evaluate(() => ({
          doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          body: document.body.scrollWidth - document.documentElement.clientWidth,
        }));
      expect(await overflow()).toEqual({ doc: 0, body: 0 });

      for (const d of await page.locator('#faq details').all()) await d.locator('summary').click();
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 10));
        }
      });
      expect(await overflow()).toEqual({ doc: 0, body: 0 });
    });

    test('ningún elemento visible sobresale del viewport por la derecha', async ({ page }) => {
      const offenders = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const bad: string[] = [];
        document.querySelectorAll('body *').forEach((el) => {
          if (el.closest('pre') || el.closest('svg')) return; // el código tiene su propio scroll
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (getComputedStyle(el).position === 'fixed') return;
          if (r.right > vw + 1) {
            bad.push(`${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 40)}`);
          }
        });
        return bad.slice(0, 10);
      });
      expect(offenders).toEqual([]);
    });

    test('RF-01 título, eslogan y CTA principal visibles sin scroll', async ({ page }) => {
      const hero = page.locator('#inicio');
      const viewportHeight = page.viewportSize()!.height;
      for (const target of [
        hero.getByRole('heading', { level: 1 }),
        hero.getByText('Asistente de voz personal con núcleo holográfico'),
        hero.getByRole('link', { name: 'Ver en GitHub' }),
      ]) {
        await expect(target).toBeVisible();
        const box = await target.boundingBox();
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight);
      }
    });

    test('los objetivos táctiles de enlaces y botones miden al menos 44 px', async ({ page }) => {
      const small = await page.evaluate(() =>
        [
          ...document.querySelectorAll<HTMLElement>(
            'header a, header button, main a, main button, footer a',
          ),
        ]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.height < 43.5 || r.width < 43.5);
          })
          .map((el) => `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 30)}`),
      );
      expect(small).toEqual([]);
    });
  });
}

test('el meta viewport no bloquea el zoom', async ({ page }) => {
  await page.goto('/');
  const content = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(content).toContain('width=device-width');
  expect(content).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/);
});
