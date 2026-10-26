import { expect, test } from '@playwright/test';

/** Anclas esperadas (SYSTEM-ARCHITECTURE §8). */
const SECTION_IDS = [
  'inicio',
  'voz',
  'instantaneas',
  'acciones',
  'documentos',
  'skills',
  'movil',
  'seguridad',
  'costes',
  'instalacion',
  'faq',
  'autor',
  'cta',
];

const GITHUB = 'https://github.com/wilrd14/Jarvis';
const PORTFOLIO = 'https://wilrd14.dev';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('existen las 13 anclas de sección, una vez cada una', async ({ page }) => {
  for (const id of SECTION_IDS) {
    await expect(page.locator(`section#${id}`), `section#${id}`).toHaveCount(1);
  }
});

test('cada sección tiene un nombre accesible (aria-labelledby) y un encabezado visible', async ({
  page,
}) => {
  for (const id of SECTION_IDS) {
    const section = page.locator(`section#${id}`);
    await expect(section).toHaveAttribute('aria-labelledby', /.+/);
    await expect(section.getByRole('heading').first()).toBeVisible();
  }
});

test('RF-01 Hero: nombre, eslogan, CTA principal a GitHub y CTA secundario a instalación', async ({
  page,
}) => {
  const hero = page.locator('#inicio');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Jarvis');
  await expect(
    hero.getByText('Asistente de voz personal con núcleo holográfico, que corre en tu propio PC.'),
  ).toBeVisible();
  await expect(hero.getByRole('link', { name: 'Ver en GitHub' })).toHaveAttribute('href', GITHUB);
  await expect(hero.getByRole('link', { name: 'Cómo se instala' })).toHaveAttribute(
    'href',
    '#instalacion',
  );
});

test('RF-02 Voz: los cuatro puntos', async ({ page }) => {
  const s = page.locator('#voz');
  for (const title of [
    'Entrada automática',
    'Voz en tiempo real',
    'Modo conversación',
    'Modelo según la pregunta',
  ]) {
    await expect(s.getByText(title, { exact: true })).toBeVisible();
  }
  await expect(s).toContainText('modelo rápido');
  await expect(s).toContainText('potente');
});

test('RF-03 Instantáneas: ocho órdenes y «sin IA, sin coste»', async ({ page }) => {
  const s = page.locator('#instantaneas');
  for (const label of [
    'Volumen',
    'Abrir carpetas y apps',
    'Captura de pantalla',
    'Bloquear el equipo',
    'Temporizadores',
    'Notas',
    'Hora y fecha',
    'Saludos',
  ]) {
    await expect(s.getByText(label, { exact: true }), label).toBeVisible();
  }
  await expect(s.getByText('Sin IA · sin coste')).toBeVisible();
  await expect(s).toContainText('no usan IA y no cuestan nada');
});

test('RF-04 Acciones: capacidades y mención de la confirmación', async ({ page }) => {
  const s = page.locator('#acciones');
  for (const label of [
    'Correo',
    'Calendario',
    'Portapapeles',
    'Buscar y abrir archivos',
    'Abrir apps',
    'Abrir páginas',
    'Recordatorios',
    'Alarmas',
  ]) {
    await expect(s.getByText(label, { exact: true }), label).toBeVisible();
  }
  await expect(s.getByText(/Resumen del día/)).toBeVisible();
  await expect(s.getByText('«¿Qué estoy viendo?»')).toBeVisible();
  await expect(s).toContainText('piden confirmación');
});

test('RF-05 Documentos: 8 formatos, carpeta sin sobrescribir y coste antes de confirmar', async ({
  page,
}) => {
  const s = page.locator('#documentos');
  for (const f of ['Word', 'PDF', 'Excel', 'PowerPoint', 'Markdown', 'HTML', 'Texto', 'CSV']) {
    await expect(s.getByText(f, { exact: true }).first(), f).toBeVisible();
  }
  await expect(s).toContainText('Documentos\\Jarvis');
  await expect(s).toContainText('sin sobrescribir');
  await expect(s).toContainText('coste estimado antes de confirmar');
});

test('RF-06 Skills y memoria: 7 skills, solo instrucciones, memoria desactivable y borrable', async ({
  page,
}) => {
  const s = page.locator('#skills');
  await expect(s.getByRole('list', { name: 'Skills incluidas' }).getByRole('listitem')).toHaveCount(7);
  await expect(s).toContainText('nunca se ejecuta código');
  await expect(s).toContainText('Markdown');
  await expect(s).toContainText('Ajustes');
  const memory = s.getByRole('list', { name: 'Control de la memoria' });
  await expect(memory).toContainText('Se puede desactivar');
  await expect(memory).toContainText('Se puede borrar');
});

test('RF-07 Móvil: 3 pasos, Tailscale, PC encendido y acciones en el PC', async ({ page }) => {
  const s = page.locator('#movil');
  for (const name of ['Instala Tailscale', 'Publica Jarvis y define un PIN', 'Ábrelo en el celular']) {
    await expect(s.getByRole('heading', { level: 3, name })).toBeVisible();
  }
  await expect(s).toContainText('sin exponerlo a internet');
  await expect(s).toContainText('PIN');
  await expect(s).toContainText('encendido');
  await expect(s).toContainText('se ejecutan en el PC');
});

test('RF-08 Seguridad: las seis garantías', async ({ page }) => {
  const s = page.locator('#seguridad');
  for (const title of [
    'Solo escucha dentro de tu equipo',
    'Frena las órdenes que llegan desde otras webs',
    'Solo hace lo que está permitido, y con tu visto bueno',
    'Tus claves no salen del servidor',
    'Acceso remoto protegido con PIN',
    'Tus documentos, en un solo lugar',
  ]) {
    await expect(s.getByText(title, { exact: true }), title).toBeVisible();
  }
  await expect(s).toContainText('loopback');
  await expect(s).toContainText('HMAC');
  await expect(s).toContainText('scrypt');
  await expect(s).toContainText('5 intentos');
});

test('RF-09 Costes: las cinco ideas y ningún precio inventado', async ({ page }) => {
  const s = page.locator('#costes');
  await expect(s).toContainText('OpenRouter');
  await expect(s).toContainText('se paga por uso');
  await expect(s).toContainText('órdenes locales no cuestan nada');
  await expect(s).toContainText('caché de voz');
  await expect(s).toContainText('saldo real');
  await expect(s).toContainText('tope mensual');
  const text = (await s.innerText()).replace(/\s+/g, ' ');
  expect(text, 'no debe haber importes en moneda').not.toMatch(/[$€£]\s?\d|\d\s?(USD|EUR|€|\$)/i);
});

test('RF-10 Instalación: pasos, comandos y atajo del README', async ({ page }) => {
  const s = page.locator('#instalacion');
  await expect(s).toContainText('git clone https://github.com/wilrd14/Jarvis.git');
  await expect(s).toContainText('npm install');
  await expect(s).toContainText('npm run app:install');
  await expect(s).toContainText('Node.js 20 o superior');
  await expect(s).toContainText('Permite el micrófono');
  await expect(s.locator('ol > li')).toHaveCount(4);
  await expect(s).toContainText('Ctrl+Alt+J');
  await expect(s).toContainText('API key de OpenRouter');
  await expect(s).toContainText('Ajustes');
  expect(await s.locator('[data-codeblock]').count()).toBeGreaterThanOrEqual(2);
  await expect(s.getByRole('button', { name: 'Copiar comando' }).first()).toBeVisible();
});

test('RF-11 Autor y pie: enlaces al portafolio y al repositorio, año y rel seguro', async ({
  page,
}) => {
  const author = page.locator('#autor');
  await expect(author).toContainText('Williams Villavizar');
  const portfolio = author.getByRole('link', { name: 'Ver portafolio' });
  await expect(portfolio).toHaveAttribute('href', PORTFOLIO);
  await expect(portfolio).toHaveAttribute('rel', /noopener/);

  const footer = page.getByRole('contentinfo');
  const gh = footer.getByRole('link', { name: 'GitHub' });
  const pf = footer.getByRole('link', { name: 'Portafolio' });
  await expect(gh).toHaveAttribute('href', GITHUB);
  await expect(pf).toHaveAttribute('href', PORTFOLIO);
  await expect(gh).toHaveAttribute('rel', /noopener/);
  await expect(pf).toHaveAttribute('rel', /noopener/);
  await expect(footer).toContainText(String(new Date().getFullYear()));
  await expect(footer).toContainText('Williams Villavizar');
});

test('RF-14 FAQ: al menos 6 preguntas del PRD, operables con teclado', async ({ page }) => {
  const s = page.locator('#faq');
  const items = s.locator('details');
  expect(await items.count()).toBeGreaterThanOrEqual(6);
  for (const q of [
    '¿Necesita internet?',
    '¿Cuánto cuesta?',
    '¿Funciona en Mac o Linux?',
    '¿Mis datos salen de mi PC?',
    '¿Qué es OpenRouter?',
    '¿Puedo crear mis propias skills?',
  ]) {
    await expect(s.getByText(q, { exact: true }), q).toBeVisible();
  }

  const first = items.first();
  await expect(first).not.toHaveAttribute('open', '');
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('p')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(first).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(first).toHaveAttribute('open', '');
});

test('RF-14 FAQ: se pueden abrir varias preguntas con el ratón', async ({ page }) => {
  const items = page.locator('#faq details');
  await items.nth(0).locator('summary').click();
  await items.nth(1).locator('summary').click();
  await expect(items.nth(0)).toHaveAttribute('open', '');
  await expect(items.nth(1)).toHaveAttribute('open', '');
});

test('RF-14 FAQ: no promete compatibilidad con Mac/Linux', async ({ page }) => {
  const item = page.locator('#faq details', { hasText: '¿Funciona en Mac o Linux?' });
  await item.locator('summary').click();
  await expect(item).toContainText('solo funciona en Windows');
  await expect(item).not.toContainText(/sí funciona|compatible con (mac|linux)/i);
});

test('RF-16 CTA final: enlace a GitHub y secundario a instalación', async ({ page }) => {
  const s = page.locator('#cta');
  await s.scrollIntoViewIfNeeded();
  const gh = s.getByRole('link', { name: 'Ver en GitHub' });
  await expect(gh).toBeVisible();
  await expect(gh).toHaveAttribute('href', GITHUB);
  await expect(s.getByRole('link', { name: 'Cómo se instala' })).toHaveAttribute(
    'href',
    '#instalacion',
  );
});

test('OBJ-01 al menos 2 CTAs a GitHub, todos con rel seguro', async ({ page }) => {
  const links = page.locator(`a[href="${GITHUB}"]`);
  expect(await links.count()).toBeGreaterThanOrEqual(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('veracidad: no se afirma «código abierto» (Q-01 abierta)', async ({ page }) => {
  const text = (await page.locator('main').innerText()).toLowerCase();
  expect(text).not.toContain('código abierto');
  expect(text).not.toContain('open source');
});

test('los enlaces ancla internos apuntan a ids existentes', async ({ page }) => {
  const hrefs = await page
    .locator('a[href^="#"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') as string));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    await expect(page.locator(href), href).toHaveCount(1);
  }
});

test('RF-13 metadatos básicos: título, descripción y Open Graph', async ({ page }) => {
  await expect(page).toHaveTitle(/Jarvis/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
});
