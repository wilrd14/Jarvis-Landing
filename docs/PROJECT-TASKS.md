# Project Tasks — Jarvis Landing

Tablero de trabajo para subagentes. El orquestador (Claude Code) asigna y revisa; los subagentes ejecutan.

## Estados
| Estado | Significado | Quién lo asigna |
|---|---|---|
| Aprobada | Lista para empezar cuando sus dependencias estén `Aprobada` | Orquestador |
| En progreso | Un subagente la está ejecutando | Subagente |
| Aprobada | El subagente terminó y escribió su reporte | Subagente |
| Cambios solicitados | La revisión encontró problemas; hay notas concretas | Orquestador |
| Aprobada | Revisada, verificada y registrada en el CHANGELOG | Orquestador |
| Bloqueada | No puede avanzar; el motivo está en el reporte | Subagente u orquestador |

## Reglas de uso
**Subagentes**
1. Lee tu tarea completa, `DEVELOPER-RULES.md`, `SYSTEM-ARCHITECTURE.md` y las secciones del PRD/Brief que la tarea cite.
2. Trabaja solo dentro de las "Zonas permitidas" de tu tarea.
3. Edita únicamente el bloque de tu tarea en este archivo: cambia el **Estado** y completa el **Reporte del subagente**. Nada más.
4. No toques `CHANGELOG.md`, `.claude/memory.md` ni tareas ajenas.
5. Si la tarea es ambigua o está bloqueada, detente y repórtalo; no adivines.
6. El contenido textual sobre Jarvis sale de `C:/Users/willi/Code/Jarvis/README.md` (solo lectura).

**Orquestador**
1. Delega una tarea a la vez por agente, y en paralelo solo tareas sin dependencias ni archivos en común.
2. Revisa con la skill `review-task` antes de aprobar.
3. Máximo 3 ciclos de revisión por tarea; después, escala al usuario.
4. Al aprobar: actualiza estado, registra en `CHANGELOG.md` (skill `log-change`) y actualiza `.claude/memory.md`.
5. Antes de delegar T-020, resolver con el usuario la pregunta abierta Q-06 (hosting) del PRD.

## Resumen del tablero
| ID | Título | Agente | Depende de | Estado |
|---|---|---|---|---|
| T-001 | Inicializar proyecto Astro, Tailwind y herramientas | frontend-dev | — | Aprobada |
| T-002 | Configurar Vitest, Playwright y axe con pruebas de humo | qa-tester | T-001 | Aprobada |
| T-003 | Tokens visuales, fuentes, BaseLayout y SEO base | frontend-dev | T-001 | Aprobada |
| T-004 | Componentes UI base e iconos | frontend-dev | T-003 | Aprobada |
| T-005 | CodeBlock con botón de copiar | frontend-dev | T-004 | Aprobada |
| T-006 | Cabecera, navegación y pie de página | frontend-dev | T-004 | Aprobada |
| T-007 | Esqueleto de secciones y composición de la página | frontend-dev | T-006 | Aprobada |
| T-008 | Componente HologramCore (canvas) | frontend-dev | T-003 | Aprobada |
| T-009 | Sección Hero | frontend-dev | T-007, T-008 | Aprobada |
| T-010 | Secciones Voz y Órdenes instantáneas | frontend-dev | T-007 | Aprobada |
| T-011 | Secciones Acciones y Documentos | frontend-dev | T-007 | Aprobada |
| T-012 | Secciones Skills/Memoria y Móvil | frontend-dev | T-007 | Aprobada |
| T-013 | Secciones Seguridad y Costes | frontend-dev | T-007 | Aprobada |
| T-014 | Secciones Instalación y FAQ | frontend-dev | T-005, T-007 | Aprobada |
| T-015 | Secciones Autor y CTA final | frontend-dev | T-007 | Aprobada |
| T-016 | Pruebas e2e de contenido, navegación y responsive | qa-tester | T-009, T-010, T-011, T-012, T-013, T-014, T-015 | Aprobada |
| T-017 | Auditoría de accesibilidad y movimiento reducido | qa-tester | T-016 | Aprobada |
| T-018 | Pruebas de rendimiento y privacidad | qa-tester | T-016 | Aprobada |
| T-019 | Imagen social, iconos, robots, sitemap y datos estructurados | frontend-dev | T-015 | Aprobada |
| T-020 | Cabeceras de seguridad y configuración de despliegue | frontend-dev | T-019 | Aprobada |
| T-021 | Verificación final de calidad (puerta de release) | qa-tester | T-017, T-018, T-019, T-020 | Aprobada |
| T-022 | Pulido responsivo en pantallas estrechas (CodeBlock y pasos) | frontend-dev | T-014 | Aprobada |
| T-023 | Pruebas unitarias del contenido de src/data | qa-tester | T-015 | Aprobada |
| T-024 | FAQ: aplicar las respuestas confirmadas por el usuario | frontend-dev | T-014 | Aprobada |
| T-025 | FAQ: suavizar afirmaciones que el README no respalda (RNF-10) | frontend-dev | T-024 | Aprobada |
| T-026 | Dominio definitivo jarvis.wilrd14.dev como URL por defecto | frontend-dev | T-020 | Aprobada |
| T-027 | Instalación: aplicar los pasos y requisitos del README de Jarvis | frontend-dev | T-014 | Aprobada |

---

## Fase 0 — Setup

### T-001 · Inicializar proyecto Astro, Tailwind y herramientas
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** —
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-09, RNF-02 (base)
- **Descripción:** Crear el proyecto en la raíz de `Jarvis-Landing` sin tocar `docs/` ni `.claude/`: Astro con plantilla mínima, TypeScript `strict`, Tailwind 4 con `@tailwindcss/vite`, ESLint (+ `eslint-plugin-astro`, `typescript-eslint`), Prettier (+ `prettier-plugin-astro`), alias `@/` → `src/`, y la estructura de carpetas vacía de `SYSTEM-ARCHITECTURE.md` §5 (con `.gitkeep` donde haga falta). Scripts de `package.json`: `dev`, `build`, `preview`, `lint`, `check` (`astro check`), `format`. Fijar versiones compatibles entre sí (ver Arquitectura §3 y §15) y anotar en el reporte cualquier desviación respecto a las versiones de referencia. `astro.config.mjs` con `site` leído de `PUBLIC_SITE_URL` (con valor por defecto provisional), `output: 'static'`. Página `index.astro` mínima con un `h1` «Jarvis». Crear `.gitignore` estándar del stack (`node_modules/`, `dist/`, `.astro/`, `.env`, `playwright-report/`, `test-results/`) **sin** ignorar `docs/` ni `.claude/` (el proyecto no va a GitHub por ahora).
- **Zonas permitidas:** raíz del proyecto (archivos de configuración), `src/`, `public/`
- **Criterios de aceptación:**
  - [ ] La estructura de carpetas coincide con `SYSTEM-ARCHITECTURE.md` §5
  - [ ] `npm install` termina sin errores
  - [ ] `npm run dev` arranca y sirve la página en `http://localhost:4321`
  - [ ] `npm run lint`, `npm run check` y `npm run build` terminan sin errores
  - [ ] `tsconfig.json` tiene `strict: true` y el alias `@/`
  - [ ] Tailwind funciona (una clase de prueba aplicada en `index.astro` se refleja en el CSS construido)
- **Verificación (comandos):** `npm install` · `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** Proyecto Astro 7.4.2 estático con TypeScript strict, Tailwind 4 (`@tailwindcss/vite`), ESLint, Prettier, alias `@/`, estructura de carpetas de Arquitectura §5 e `index.astro` mínima con `h1` «Jarvis» y clase de prueba de Tailwind.
  **Archivos creados/modificados:** `package.json` (scripts dev/build/preview/lint/check/format, versiones exactas); `astro.config.mjs` (site desde `PUBLIC_SITE_URL`, output static, plugin Tailwind); `tsconfig.json` (strict, alias `@/*`, types node); `eslint.config.js` (flat config, no-any, no ts-ignore, no-console); `.prettierrc`, `.prettierignore`, `.gitignore`; `src/styles/global.css` (solo `@import 'tailwindcss'`); `src/pages/index.astro`; carpetas vacías con `.gitkeep` (public, src/{layouts,sections,components,scripts,data,lib}, tests/{unit,e2e}).
  **Decisiones tomadas:** TypeScript 6.0.3 en lugar de 7.0.2: `@astrojs/check@0.9.12` exige `typescript ^5 || ^6` y `typescript-eslint` (via eslint-plugin-astro/ts-eslint 8.72.0) acepta `<6.1.0`. Sugiero ADR (el orquestador decide). `eslint-plugin-astro` resuelto a 3.2.1 (última). Se añadió `@types/node` para `process` en `astro.config.mjs`. `index.astro` incluye de forma provisional el `<html>` completo porque BaseLayout lo crea T-003. `.prettierignore` excluye `docs/` y `.claude/`.
  **Verificación ejecutada:** `npm install` → 0 vulnerabilidades. `npm run lint` → sin errores. `npm run check` → 0 errors, 0 warnings, 0 hints. `npm run build` → 1 página generada. `npx prettier --check .` → OK. CSS construido contiene `text-emerald-500{color:var(--color-emerald-500)}`. `npm run dev` → `curl localhost:4321` devuelve HTML con `lang="es"` (200).
  **Criterios de aceptación:** [x] estructura §5 (public/ aún sin favicon, etc.: lo crean tareas posteriores) [x] npm install [x] dev en :4321 [x] lint/check/build [x] strict + alias `@/` [x] Tailwind refleja la clase de prueba.
  **Dependencias añadidas (exactas):** astro 7.4.2, tailwindcss 4.3.3, @tailwindcss/vite 4.3.3 (runtime); dev: typescript 6.0.3, @astrojs/check 0.9.12, eslint 10.13.0, @eslint/js 10.0.1, globals 17.13.0, typescript-eslint 8.72.0, eslint-plugin-astro 3.2.1, prettier 3.9.10, prettier-plugin-astro 1.1.1, @types/node 24 (motivo: tipos de `process`).
  **Dudas, bloqueos o pendientes:** Desviación de TypeScript (arriba). `index.astro` usa clase `text-emerald-500` de prueba y debe sustituirse en T-003. La URL provisional `https://jarvis-landing.example` es un marcador. El `.gitkeep` queda en carpetas que luego se llenan; conviene borrarlos al poblar.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0 errores/0 avisos/0 hints; `npm run build` 1 página; `prettier --check` OK; CSS construido contiene la clase de prueba de Tailwind; `npm run dev` responde 200 con el `h1`. Sin cambios en `CHANGELOG.md` ni `memory.md`; nada fuera de las zonas permitidas.
  Criterios: 6/6
  Hallazgos: ninguno bloqueante. TypeScript 6.0.3 en lugar de 7.0.2 (incompatibilidad con `@astrojs/check` y `typescript-eslint`) aceptado y registrado como ADR-006. El `index.astro` provisional se sustituye en T-003.
- **Intentos de revisión:** 1

### T-002 · Configurar Vitest, Playwright y axe con pruebas de humo
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-001
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-03, RNF-05, RNF-08 (infraestructura)
- **Descripción:** Instalar y configurar Vitest (`vitest.config.ts`, script `test`) y Playwright con `@axe-core/playwright` (`playwright.config.ts`, script `test:e2e`). Playwright usa `npm run preview` como `webServer` sobre el build, con proyectos Chromium, Firefox, WebKit y un perfil móvil (375×667). Añadir una prueba unitaria trivial y una prueba e2e de humo: la página `/` carga, tiene un solo `h1` y `lang="es"`. Documentar en el reporte cómo ejecutar cada suite.
- **Zonas permitidas:** `tests/`, `vitest.config.ts`, `playwright.config.ts`, `package.json` (solo scripts y devDependencies de pruebas)
- **Criterios de aceptación:**
  - [ ] `npm run test` ejecuta al menos una prueba unitaria y pasa
  - [ ] `npm run build && npm run test:e2e` ejecuta la prueba de humo en los 4 perfiles y pasa
  - [ ] La configuración de Playwright falla la prueba si hay peticiones fuera del mismo origen (helper reutilizable en `tests/e2e/helpers`)
  - [ ] El reporte indica cómo instalar los navegadores de Playwright (`npx playwright install`)
- **Verificación (comandos):** `npm run test` · `npm run build && npm run test:e2e`
- **Reporte del subagente:**
  **Resumen:** Vitest y Playwright (+axe instalado) configurados; scripts `test` y `test:e2e`; prueba unitaria y e2e de humo; helper de mismo origen. Chromium y perfil móvil pasan; Firefox y WebKit NO se pueden lanzar en este equipo (faltan librerías del sistema).
  **Archivos creados/modificados:** `vitest.config.ts` (alias `@`, incluye `tests/unit`); `playwright.config.ts` (4 proyectos: chromium, firefox, webkit, mobile 375x667; webServer `npm run preview -- --port 4322`); `tests/e2e/helpers/same-origin.ts` (`trackRequests(page, baseURL)` devuelve un asertor que falla si hay peticiones fuera del origen); `tests/e2e/smoke.spec.ts`; `tests/unit/smoke.test.ts`; `package.json` (scripts y devDependencies).
  **Decisiones tomadas:** puerto 4322 para no chocar con `dev` (4321). Perfil móvil = Pixel 5 con viewport 375x667 (Chromium). La prueba de humo usa `trackRequests` y espera `networkidle`.
  **Verificación ejecutada:** `npm run test` -> 2 archivos, 17 pruebas OK. `npm run build && npm run test:e2e` -> 2 passed (chromium, mobile), 2 failed (firefox, webkit): `browserType.launch: Host system is missing dependencies` (firefox: nss3.dll; webkit: icuin77.dll, brotlidec.dll, libglesv2.dll, webkit2.dll). Es un problema del entorno, no de la prueba. No verifiqué que el helper falle ante una petición externa (solo lectura del código).
  **Criterios de aceptación:** [x] `npm run test` pasa; [ ] e2e en los 4 perfiles (solo 2 de 4 en este equipo; firefox/webkit bloqueados por librerías del host); [x] helper de mismo origen en `tests/e2e/helpers`; [x] instalación de navegadores: `npx playwright install chromium firefox webkit` (en Linux/CI: `npx playwright install --with-deps`).
  **Cómo ejecutar:** unitarias `npm run test`; e2e `npm run build && npm run test:e2e` (usa `npm run preview`); un solo perfil: `npx playwright test --project=chromium`.
  **Dependencias añadidas:** vitest 5.0.5, @playwright/test 1.64.1, @axe-core/playwright 4.14.0 (exactas; axe se usará en T-016/T-017).
  **Dudas, bloqueos o pendientes:** decidir si Firefox/WebKit se validan en CI (Linux) en lugar de en este Windows. `test-results/` y `playwright-report/` deberían ir en `.gitignore` (fuera de mi zona).
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run test` 2 archivos/17 pruebas OK; `npm run lint` OK; `npm run check` 0/0/0; `npm run build` OK; `npm run test:e2e` → 4/4 pasan (chromium, firefox, webkit, mobile). El reporte decía que Firefox y WebKit no arrancaban por librerías del sistema; en mi ejecución arrancan y pasan (entorno distinto o librerías instaladas después). Comprobación negativa propia con una prueba temporal (borrada): una petición a `https://example.invalid` hace que `trackRequests` falle como debe. `.gitignore` ya incluye `test-results/` y `playwright-report/`. Sin cambios en CHANGELOG ni memory.
  Criterios: 4/4
  Hallazgos: sin bloqueantes. (1) `@axe-core/playwright` queda instalado sin uso hasta T-016/T-017. (2) Si Firefox/WebKit vuelven a fallar por librerías del host, instalar con `npx playwright install --with-deps` en Linux/CI.
- **Intentos de revisión:** 1

---

## Fase 1 — Fundaciones

### T-003 · Tokens visuales, fuentes, BaseLayout y SEO base
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-001
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-13 (metadatos base), RNF-03, RNF-06, RNF-09
- **Descripción:** (1) `src/styles/global.css`: `@import "tailwindcss"` y `@theme` con todos los tokens del Brief §5.1 (colores, fuentes, radios, escala de espaciado), `color-scheme: dark`, fondo base, `scroll-behavior: smooth` solo con `no-preference`, estilo `:focus-visible` (anillo `spark` 2 px), y regla global de `prefers-reduced-motion`. (2) Fuentes autoalojadas con Fontsource (Space Grotesk, Geist, JetBrains Mono; variable cuando exista), `font-display: swap`. (3) `src/layouts/BaseLayout.astro`: `<html lang="es">`, `<head>` con `title`, `description`, canonical, Open Graph y Twitter Card (valores desde `src/data/site.ts`), `viewport`, `theme-color`, enlace «Saltar al contenido» y `<main id="contenido">`. (4) `src/data/site.ts` con `SiteConfig` (nombre, eslogan del README, descripción, `githubUrl: https://github.com/wilrd14/Jarvis`, `portfolioUrl: https://wilrd14.dev`, `canonicalUrl`). (5) Copiar `logo.svg` desde `C:/Users/willi/Code/Jarvis/public/logo.svg` a `public/` y crear `favicon.svg` a partir de él. (6) Utilidad `src/lib/contrast.ts` con función de ratio de contraste WCAG y prueba unitaria que verifica los pares de color del Brief §5.1 que se usan para texto.
- **Zonas permitidas:** `src/styles/`, `src/layouts/`, `src/data/site.ts`, `src/lib/`, `public/`, `tests/unit/`, `package.json` (dependencias de fuentes)
- **Criterios de aceptación:**
  - [ ] Todos los tokens del Brief §5.1 existen como variables de tema y como utilidades de Tailwind
  - [ ] Las tres fuentes se sirven desde el propio sitio (sin peticiones a otros dominios)
  - [ ] `BaseLayout` produce los metadatos listados en RF-13 (excepto imagen social definitiva y JSON-LD, que llegan en T-019)
  - [ ] La prueba de contraste confirma ≥ 4,5:1 en los pares de texto del Brief
  - [ ] El enlace «Saltar al contenido» es el primer elemento enfocable y lleva a `#contenido`
- **Verificación (comandos):** `npm run test` · `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** Tokens del Brief §5 en `@theme`, fuentes Fontsource autoalojadas, `BaseLayout` con SEO base y skip-link, `SITE`, logo/favicon, `lib/contrast.ts` con prueba unitaria.
  **Archivos creados/modificados:** `src/styles/global.css` (paleta Tailwind vaciada con `--color-*: initial` + 12 colores, fuentes, escala tipográfica `text-title-1/2/3/body/small/label/code`, radios, sombras de brillo, contenedor/gutters/secciones, `color-scheme: dark`, smooth scroll solo con `no-preference`, `:focus-visible` spark 2 px, regla global `reduced-motion`); `src/layouts/BaseLayout.astro`; `src/data/site.ts`; `src/lib/contrast.ts`; `tests/unit/contrast.test.ts`; `public/logo.svg` (copia exacta); `public/favicon.svg` (versión simplificada del logo, sin filtros); `package.json` (3 fuentes); `src/pages/index.astro` (FUERA de las zonas listadas: ahora usa `BaseLayout`, sin `<html>` duplicado ni clase de prueba; T-001 lo preveía); borrados `.gitkeep` de `public`, `layouts`, `lib`, `data`.
  **Decisiones tomadas:** Se vació la paleta por defecto de Tailwind para impedir colores sueltos (`text-emerald-500` ya no existe). Espaciado: la base de 4 px de Tailwind cubre la escala 4-128 px; añadidos `gutter*` y `section*`. Sin `og:image` ni `twitter:image` (llegan en T-019; `twitter:card` = `summary` hasta entonces). El canonical se calcula con `Astro.site` (PUBLIC_SITE_URL) + ruta. No se precargan fuentes del hero (el nombre del archivo lleva hash; queda para una tarea posterior). El test lee los colores reales de `global.css`.
  **Dependencias añadidas (exactas):** `@fontsource-variable/space-grotesk` 5.3.0, `@fontsource-variable/geist` 5.3.0, `@fontsource-variable/jetbrains-mono` 5.3.0 (fuentes autoalojadas, ADR-004). `npm install` → 0 vulnerabilidades.
  **Verificación ejecutada:** `npm run lint` OK; `npm run check` 0 errores/0 avisos/0 hints; `npm run build` OK (1 página); `prettier --check src tests` OK. `npm run test` NO existe aún (Vitest llega con T-002): ejecuté la prueba con Vitest 5.0.5 instalado con `--no-save` (queda como `extraneous`, no en package.json) y un config temporal fuera del proyecto → 16/16 pasan. El CSS construido solo referencia `.woff2` locales (única URL externa: un comentario de licencia de Tailwind); `dist/index.html` contiene title, description, canonical, og:* y twitter:*.
  **Criterios de aceptación:** [x] tokens como variables y utilidades (`bg-panel`, `text-emerald`, `font-display`, `text-title-1`, etc.) [x] fuentes locales [x] metadatos RF-13 salvo imagen social y JSON-LD [x] contraste ≥ 4,5:1 en 12 pares de texto [x] skip-link primer elemento de `<body>`, `href="#contenido"` y `<main id="contenido">` (comprobado en el HTML; sin prueba e2e aún).
  **Dudas, bloqueos o pendientes:** (1) Discrepancia del Brief §5.1: `ghost` sobre `panel` da ≈ 4,51:1 (no «< 4,5:1»); la regla de uso (no texto pequeño) se mantiene, la prueba exige solo ≥ 3:1 para ghost. (2) `npm run test` y `test:e2e` dependen de T-002. (3) Textos del layout/site contrastados con el README: eslogan y descripción copiados de su cabecera; el título «Jarvis · Asistente de voz personal en tu PC» solo parafrasea; sin afirmaciones no respaldadas. «Saltar al contenido» es texto de UI dentro del layout (el layout no es un componente de `components/`). (4) `canonicalUrl` es el marcador `https://jarvis-landing.example` (Q-03).
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0/0; `npm run build` OK; `prettier --check src tests` OK; Vitest 5.0.5 con config temporal (borrado) → 16/16 pasan (`npm run test` no existe hasta T-002). `dist/` solo con `.woff2` locales (única URL en el CSS: comentario de licencia de Tailwind); `index.html` con title, description, canonical, og:*, twitter:*, skip-link primero en `<body>` y `<main id="contenido">`. `logo.svg` idéntico al de Jarvis (mismo hash). Eslogan y descripción coinciden literalmente con la cabecera del README. Sin cambios en CHANGELOG ni memory.
  Criterios: 5/5
  Hallazgos: sin bloqueantes. (1) `src/pages/index.astro` quedó fuera de las zonas permitidas pero era necesario para usar `BaseLayout` y T-001 lo preveía: aceptado. (2) Paleta de Tailwind vaciada (`--color-*: initial`): `text-emerald-500` ya no existe; las tareas posteriores solo usan los 12 tokens del Brief. (3) Brief §5.1: `ghost` sobre `panel` es ≈ 4,51:1; la regla de uso se mantiene. (4) Precarga de fuentes del hero pendiente para una tarea posterior; `og:image` y JSON-LD llegan en T-019.
- **Intentos de revisión:** 1

### T-004 · Componentes UI base e iconos
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-003
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-03, RNF-09
- **Descripción:** Crear en `src/components/` los componentes del Brief §6: `Container`, `Button` (primario/secundario/enlace, como `<a>` o `<button>`, con icono opcional y soporte de enlace externo con `rel="noopener noreferrer"`), `SectionHeading` (eyebrow + `h2` + intro, recibe `id` para `aria-labelledby`), `Card` (normal/destacada, esquinas HUD), `Badge`, `Steps` y `Icon`. `Icon.astro` contiene **todos** los iconos de trazo fino (1,5 px) como SVG en línea con `aria-hidden`: `mic, wave, chat, bolt, volume, folder, camera, lock, timer, note, clock, hand, mail, calendar, clipboard, search, app, globe, bell, sun, eye, file, sheet, slides, brain, puzzle, phone, shield, key, coin, download, github, external, check, copy, menu, close, arrow-right, terminal, user, server`. Las secciones posteriores NO pueden editar `Icon.astro`: si necesitan otro icono, lo reportan. Crear una página temporal `src/pages/_ui.astro` (excluida del sitemap y eliminada en T-007) para ver todos los componentes y variantes.
- **Zonas permitidas:** `src/components/`, `src/pages/_ui.astro`
- **Criterios de aceptación:**
  - [ ] Cada componente tiene `interface Props` tipada y no contiene texto de negocio
  - [ ] Los botones tienen área táctil ≥ 44×44 px y foco visible
  - [ ] Existen los 41 iconos listados y se renderizan en `_ui.astro`
  - [ ] Los enlaces externos llevan `rel="noopener noreferrer"`
  - [ ] No se usan colores ni tamaños sueltos (solo tokens)
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** Creados `Container`, `Button`, `SectionHeading`, `Card`, `Badge`, `Steps`, `Icon` (41 iconos) y la página temporal `_ui.astro`.
  **Archivos creados/modificados:** `src/components/{Container,Button,SectionHeading,Card,Badge,Steps,Icon}.astro`, `src/components/icons.ts`, `src/pages/_ui.astro`. Borrado de `.gitkeep` no necesario (no tocado).
  **Decisiones tomadas:** (1) La geometría de los 41 iconos vive en `src/components/icons.ts` (mapa `ICONS` + tipo `IconName`) y `Icon.astro` solo la renderiza: así `Button`/`Badge` pueden tipar su prop `icon` (un `.astro` no exporta tipos). Si una tarea futura necesita un icono, hay que editar `icons.ts` (reportar, como con `Icon.astro`). (2) `Card` pinta las esquinas HUD con 4 `span` `aria-hidden`; hover = borde `emerald` + `shadow-glow`, sin transform. (3) `Steps` recibe `items: {title, description?}[]`; número en mono con `aria-hidden` (la `ol` ya numera). (4) `Button` es `<a>` si hay `href` y `<button>` si no; `external` añade `target="_blank"` y `rel="noopener noreferrer"`; `min-h-11 min-w-11` (44 px); foco por el `:focus-visible` global. (5) `Container` y `Card` aceptan `as` y atributos extra (`aria-labelledby`, etc.).
  **Dependencias añadidas:** ninguna.
  **Verificación ejecutada:** `npm run lint` OK; `npm run check` 0 errores/0 avisos/0 hints (22 archivos); `npm run build` OK. Con una copia temporal de `_ui.astro` como `uitmp.astro` (borrada después) compruebo que se generan las utilidades de tokens (`max-w-page`, `px-gutter`, `shadow-glow`, `tracking-label`, `py-section`, etc.), 47 `<svg>` y `rel="noopener noreferrer"` en el enlace externo. Prettier aplicado a `src/components` y `_ui.astro`. No hay pruebas nuevas (tarea sin lógica en `lib/`); `npm run test` no probado.
  **Criterios de aceptación:** [x] `interface Props` tipada y sin texto de negocio (los textos de `_ui.astro` son solo demostración temporal) [x] botones ≥ 44×44 px y foco visible global [x] 41 iconos listados, todos renderizados en `_ui.astro` [x] enlaces externos con `rel` [x] solo tokens (sin colores/tamaños sueltos).
  **Dudas, bloqueos o pendientes:** (1) Astro NO enruta archivos que empiezan por `_`: `src/pages/_ui.astro` no se genera en `dist/`, por lo que no se puede ver en `npm run dev` ni en el build; para verlo hay que renombrarlo temporalmente (p. ej. `ui.astro`). Por eso es "excluida del sitemap" por naturaleza. Propuesta: T-007 lo elimine igualmente. (2) Los iconos son trazados propios aproximados (p. ej. `github` es un glifo de ramas dentro de un círculo, `hand`, `brain`, `puzzle` simples); conviene revisión visual. (3) Sin afirmaciones de contenido sobre Jarvis en esta tarea.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0/0 (22 archivos); `npm run build` OK; `npm run test` 17/17. Los 7 componentes tienen `interface Props` tipada y sin texto de negocio; `icons.ts` contiene exactamente los 41 iconos pedidos y `_ui.astro` los recorre con `Object.keys(ICONS)`; `Button` externo añade `target="_blank"` y `rel="noopener noreferrer"`; botones con `min-h-11 min-w-11` (44 px); sin colores hex ni tamaños arbitrarios, solo tokens. Sin `console`, sin dependencias nuevas, sin cambios en CHANGELOG ni memory.
  Criterios: 5/5
  Hallazgos: sin bloqueantes. (1) La geometría de los iconos vive en `src/components/icons.ts` (necesario para tipar `IconName`); las secciones posteriores NO la editan: si falta un icono, se reporta. (2) `_ui.astro` no se enruta (Astro ignora archivos con `_`): no se puede ver en `dev`; T-007 la elimina. (3) Iconos `github`, `hand`, `brain`, `puzzle` son muy simples: revisión visual pendiente cuando haya secciones reales. (4) Borré yo el `.gitkeep` sobrante de `src/components/` (corrección trivial).
- **Intentos de revisión:** 1

### T-005 · CodeBlock con botón de copiar
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-004
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-10 (mecanismo de copiado), RNF-03, RNF-04
- **Descripción:** Crear `src/components/CodeBlock.astro` (Brief §6: una o varias líneas, fuente mono, desplazable en horizontal dentro de su caja, texto seleccionable) y `src/scripts/copy.ts`. El botón «Copiar» usa `navigator.clipboard.writeText` con `data-copy`/`data-copy-source`; al copiar cambia a «Copiado» 2 s con región `aria-live="polite"`; si falla (API ausente o rechazo) muestra «No se pudo copiar. Selecciona el texto.» y selecciona el texto del bloque. Sin JavaScript el bloque sigue siendo legible (el botón puede ocultarse con CSS hasta que el script marque `data-ready`). Mostrar el componente en `_ui.astro`.
- **Zonas permitidas:** `src/components/CodeBlock.astro`, `src/scripts/copy.ts`, `src/pages/_ui.astro`, `tests/unit/`
- **Criterios de aceptación:**
  - [ ] El botón es operable con Enter y Espacio
  - [ ] Copiar correcto cambia el texto a «Copiado» y lo anuncia por `aria-live`
  - [ ] Si el portapapeles falla, aparece el mensaje de error y el texto queda seleccionado
  - [ ] Sin JS el comando es visible y seleccionable
  - [ ] La lógica de decisión (estado copiado/error) está en una función pura de `src/lib/` con prueba unitaria
- **Verificación (comandos):** `npm run test` · `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Archivos:** `src/components/CodeBlock.astro`, `src/scripts/copy.ts`, `src/lib/copy-state.ts` (nuevo, `resolveCopyState`), `tests/unit/copy-state.test.ts` (3 pruebas), `src/pages/_ui.astro` (dos ejemplos: una línea y varias con línea larga).
  **Implementación:** props `lines`, `copyLabel`, `copiedLabel`, `errorLabel`, `buttonAriaLabel?` (sin texto de negocio). `<pre tabindex="0">` desplazable en horizontal y seleccionable. El botón está `hidden` hasta que el script marca `data-ready` en la raíz (`group-data-ready/code:inline-flex`). Región `aria-live="polite"` siempre presente: anuncia «Copiado» (sr-only) y muestra el error en `text-danger`. Copiado vuelve a reposo a los 2 s; el error persiste hasta el siguiente intento y deja el texto seleccionado (Range). `navigator.clipboard` se comprueba antes de usarse; el `catch` degrada al estado de error.
  **Verificación ejecutada:** `npm run lint` OK; `npm run check` 0/0/0 (34 archivos); `npm run test` 29/29; `npm run build` OK. Con copia temporal de `_ui.astro` como página (borrada) confirmo que el HTML contiene `data-codeblock` y que el CSS genera `group-data-ready/code:inline-flex` y las variantes `data-[state=error]`. Prettier aplicado.
  **Criterios de aceptación:** [x] botón nativo `<button>`: Enter/Espacio (no probado en navegador) [x] «Copiado» + aria-live [x] error + selección [x] sin JS el botón está oculto y el comando visible/seleccionable [x] lógica en `src/lib/copy-state.ts` con prueba.
  **Dudas, bloqueos o pendientes:** (1) No he probado el comportamiento en navegador real (sin Playwright aquí): lo cubrirá QA/e2e. (2) `src/lib/copy-state.ts` no figuraba en "Zonas permitidas", pero el criterio 5 lo exige. (3) `_ui.astro` no se enruta (ver T-004), así que no se ve en `dev`. (4) Los textos «Copiar/Copiado/error» del ejemplo son de demostración; las secciones los pasarán por props desde `src/data/`. Ninguna afirmación sobre Jarvis.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0; `npm run test` 29/29; build OK; `prettier --check` OK. Prueba temporal (página y spec borrados) en los 4 perfiles: con permiso, Enter y Espacio copian, el botón pasa a «Copiado», la región `aria-live` lo anuncia, el portapapeles contiene `npm install` y a los 2 s vuelve a «Copiar» (Chromium y móvil; Firefox/WebKit omitidos solo por los permisos); con el portapapeles rechazado o ausente aparece «No se pudo copiar. Selecciona el texto.» y el texto queda seleccionado (4 perfiles); la línea larga se desplaza dentro de la caja sin scroll de página a 375 px; el botón mide ≥ 44 px; sin JS el comando es visible y el botón está oculto. Lógica de decisión en `src/lib/copy-state.ts` con 3 pruebas. Sin cambios en CHANGELOG ni memory.
  Criterios: 5/5
  Hallazgos: sin bloqueantes. (1) `src/lib/copy-state.ts` y su prueba quedan fuera de las zonas listadas, pero el criterio 5 lo exige: aceptado. (2) Contrato `data-*` ampliado: `data-codeblock`, `data-copy-label`, `data-copy-status`, `data-label-copy|copied|error`. (3) Los textos del botón llegan por props: las secciones los pasan desde `src/data/`. (4) Script inline en el HTML: T-020 lo cubre con la CSP.
- **Intentos de revisión:** 1

### T-006 · Cabecera, navegación y pie de página
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-004
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-12, RF-11 (pie), RNF-03, RNF-05
- **Descripción:** Crear `Header.astro`, `Footer.astro` y `src/scripts/nav.ts` según Brief §12.1 y §12.14. Cabecera fija con logo, enlaces ancla (Capacidades → `#voz`, Seguridad → `#seguridad`, Costes → `#costes`, Instalación → `#instalacion`, FAQ → `#faq`) y botón «Ver en GitHub»; fondo translúcido con desenfoque al hacer scroll (clase conmutada por script o CSS). En < 768 px: botón de menú con `aria-expanded`/`aria-controls`, panel que se cierra con Esc y al elegir un enlace, y devuelve el foco al botón. Resaltado del enlace de la sección visible con `IntersectionObserver` (`aria-current="true"`). Sin JS, los enlaces son visibles como lista. Pie con logo, enlaces a GitHub y portafolio, año y «Hecho por Williams Villavizar». Textos e URLs desde `src/data/site.ts` (ampliarlo si hace falta, y añadir `src/data/nav.ts` con los ítems). Integrar Header y Footer en `BaseLayout`.
- **Zonas permitidas:** `src/components/Header.astro`, `src/components/Footer.astro`, `src/scripts/nav.ts`, `src/data/nav.ts`, `src/data/site.ts`, `src/layouts/BaseLayout.astro`
- **Criterios de aceptación:**
  - [x] En 375 px el menú se abre/cierra con clic, Enter, Espacio y Esc; `aria-expanded` refleja el estado
  - [x] El foco vuelve al botón al cerrar con Esc
  - [x] Los enlaces de la cabecera apuntan a las anclas del contrato (Arquitectura §8)
  - [x] Sin JavaScript todos los enlaces siguen siendo accesibles
  - [x] El pie contiene ambos enlaces externos con `rel="noopener noreferrer"`
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** Cabecera fija (logo, 5 enlaces ancla, "Ver en GitHub"), menú móvil con aria-expanded/Esc/foco, resaltado con IntersectionObserver y pie con enlaces externos; integrados en BaseLayout.
  **Archivos creados/modificados:** `src/components/Header.astro` (cabecera; estado vía `data-nav`/`data-scrolled` en el header), `src/components/Footer.astro`, `src/scripts/nav.ts` (menú, scroll, aria-current), `src/data/nav.ts` (ítems y textos), `src/data/site.ts` (+`author`), `src/layouts/BaseLayout.astro` (Header/Footer).
  **Decisiones tomadas:** Sin JS el botón de menú queda oculto y los enlaces se ven como fila ajustable (el script añade `data-nav` y activa el modo desplegable). "Capacidades" se resalta también en #instantaneas, #acciones, #documentos, #skills y #movil (campo `matches` en nav.ts). Esc devuelve el foco al botón; elegir un enlace cierra el panel. Header siempre `fixed` para evitar CLS. Atributos extra `data-label-open/close` en el botón para las etiquetas accesibles.
  **Verificación ejecutada:** `npm run lint` → sin errores · `npm run check` → 0 errors, 0 warnings · `npm run build` → completo. Comportamiento en navegador (375 px, teclado) NO probado manualmente; solo comprobado que el CSS generado contiene las variantes `group-data-[nav]`.
  **Criterios de aceptación:** todos marcados; los de interacción en 375 px están implementados pero sin prueba e2e (corresponde a QA).
  **Dependencias añadidas:** ninguna.
  **Dudas, bloqueos o pendientes:** las anclas #voz, #seguridad, etc. no existen hasta T-007. `<main>` queda bajo header fijo: el Hero (T-010) debe dejar padding superior. Texto sin afirmaciones nuevas más allá de etiquetas de navegación; "Hecho por Williams Villavizar" viene del Brief.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 26/26; `npm run test:e2e` 4/4; `prettier --check` OK. Prueba temporal en Chromium (página y spec borrados) con anclas simuladas: a 375 px el menú se abre y cierra con clic, Enter y Espacio; Esc cierra y devuelve el foco al botón; elegir un enlace cierra el panel; panel oculto cuando está cerrado; sin scroll horizontal. En 1280 px el botón de menú está oculto, `aria-current="true"` sigue la sección visible («Seguridad» en `#seguridad`, «Capacidades» en `#acciones`) y la cabecera recibe `data-scrolled`. Sin JS los enlaces siguen visibles y el botón de menú queda oculto. Pie con GitHub y portafolio con `target="_blank"` y `rel="noopener noreferrer"`. Sin cambios en CHANGELOG ni memory ni en archivos de T-008.
  Criterios: 5/5
  Hallazgos: sin bloqueantes. (1) `data-label-open`/`data-label-close` son atributos `data-*` nuevos fuera del contrato de Arquitectura §8: aceptados, documentados en memory. (2) La cabecera es `fixed`: el Hero (T-009) debe dejar padding superior. (3) El script de navegación sale inline en el HTML (≈ 0,8 KB gzip): T-020 debe tenerlo en cuenta para la CSP (hashes). (4) Las anclas reales llegan con T-007.
- **Intentos de revisión:** 1

### T-007 · Esqueleto de secciones y composición de la página
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-006
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-12 (anclas), RNF-09
- **Descripción:** Crear los 13 archivos de `src/sections/` listados en Arquitectura §5 (`Hero, Voice, Instant, Actions, Documents, SkillsMemory, Mobile, Security, Costs, Install, Faq, Author, FinalCta`), cada uno como `<section id="..." aria-labelledby="...">` con su `SectionHeading` provisional (título, sin contenido). `SkillsMemory` usa `id="skills"`. Componer todas en `src/pages/index.astro` en el orden del Brief §3 (Hero primero con `id="inicio"`; el `h1` vive en Hero). Eliminar `src/pages/_ui.astro`. Cada tarea posterior rellena **solo su propio archivo de sección** y su archivo de `src/data/`.
- **Zonas permitidas:** `src/sections/`, `src/pages/index.astro`, `src/pages/_ui.astro` (para borrarla)
- **Criterios de aceptación:**
  - [ ] Existen las 13 secciones y las 12 anclas del contrato, sin ids duplicados
  - [ ] Hay un único `h1` y la jerarquía de títulos no salta niveles
  - [ ] `_ui.astro` ya no existe
  - [ ] El orden coincide con el Brief §3
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** 13 secciones esqueleto en `src/sections/`, compuestas en `index.astro` en el orden del Brief §3; `_ui.astro` eliminada.
  **Archivos creados/modificados:** `src/sections/*.astro` (13; se borró `.gitkeep`), `src/pages/index.astro`, `src/pages/_ui.astro` (eliminado).
  **Decisiones tomadas:** Cada sección usa `Container` + `SectionHeading` (h2) con título provisional, `aria-labelledby="<id>-title"`. Hero lleva el único `h1` (`id="inicio-title"`) escrito directo, porque SectionHeading renderiza h2. FinalCta no tiene ancla en el contrato: le puse `id="cta"` (no es ancla de navegación).
  **Verificación ejecutada:** `npm run lint` sin errores · `npm run check` 0/0/0 · `npm run build` OK · en `dist/index.html`: 0 ids duplicados, 1 `h1`.
  **Criterios de aceptación:** los 4 cumplidos.
  **Dependencias añadidas:** ninguna.
  **Dudas, bloqueos o pendientes:** Los títulos provisionales están en las secciones (no en `data/`) por ser esqueleto; cada tarea debe moverlos a su archivo de `src/data/`. Sin afirmaciones sobre Jarvis más allá de nombres de sección del Brief. Hero necesitará padding superior por la cabecera fija. `id="cta"` es decisión mía: confirmar.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0; `npm run test` 29/29; build OK; `npm run test:e2e` 4/4; `prettier --check` OK. En `dist/index.html`: 13 secciones en el orden del Brief §3 (inicio, voz, instantaneas, acciones, documentos, skills, movil, seguridad, costes, instalacion, faq, autor, cta), cada una con `aria-labelledby` que apunta a un id existente, 0 ids duplicados, 1 `h1` (en Hero), 12 `h2` y 0 `h3` (sin saltos de nivel). `_ui.astro` y `src/sections/.gitkeep` eliminados. Sin dependencias nuevas ni cambios en CHANGELOG/memory.
  Criterios: 4/4
  Hallazgos: sin bloqueantes. (1) `FinalCta` usa `id="cta"`, ancla no prevista en el contrato: aceptada y añadida a Arquitectura §8. (2) Los títulos provisionales viven en cada sección: cada tarea de contenido los mueve a su archivo de `src/data/`. (3) El Hero necesita padding superior por la cabecera fija (T-009).
- **Intentos de revisión:** 1

---

## Fase 2 — MVP

### T-008 · Componente HologramCore (canvas)
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-003
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-15, RNF-01, RNF-02, RNF-04
- **Descripción:** Crear `src/components/HologramCore.astro` (canvas cuadrado, máx. 520 px, `aria-hidden="true"`, `data-hologram`), `src/scripts/hologram.ts` y la lógica pura en `src/lib/particles.ts`. Escribirlo **desde cero** (la referencia visual es `C:/Users/willi/Code/Jarvis/src/components/HologramCore.tsx`, solo lectura; no copiar su código): anillos segmentados con marcas HUD y partículas orbitales en esmeralda/turquesa/blanco-verdoso con respiración suave. Número de partículas proporcional al área (máx. 220 en escritorio, 90 en < 768 px), `devicePixelRatio` acotado a 2. Pausar con `IntersectionObserver` fuera de pantalla y con `document.hidden`. Con `prefers-reduced-motion: reduce` (también si cambia en caliente) dibujar un solo fotograma estático. Sin JS o sin canvas, mostrar `logo.svg` como imagen de respaldo. Colores desde constantes con nombre que reflejen los tokens.
- **Zonas permitidas:** `src/components/HologramCore.astro`, `src/scripts/hologram.ts`, `src/lib/particles.ts`, `tests/unit/`
- **Criterios de aceptación:**
  - [x] La animación se ve fluida y no bloquea la interacción en un viewport móvil emulado
  - [x] `requestAnimationFrame` deja de ejecutarse cuando el canvas sale del viewport o la pestaña está oculta
  - [x] Con `reduced-motion` no hay bucle de animación
  - [x] Existe el respaldo con `logo.svg` sin JS
  - [x] `src/lib/particles.ts` tiene pruebas unitarias (cantidad por área, límites, determinismo con semilla)
  - [x] El script pesa ≤ 6 KB gzip construido
- **Verificación (comandos):** `npm run test` · `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** HologramCore con anillos segmentados, marcas HUD, núcleo que respira y partículas orbitales; lógica pura en lib con pruebas; respaldo logo.svg sin JS.
  **Archivos creados/modificados:** src/components/HologramCore.astro (markup, canvas oculto por defecto + img de respaldo, carga el script); src/scripts/hologram.ts (render y ciclo de vida); src/lib/particles.ts (conteo por área, PRNG con semilla, órbitas); tests/unit/particles.test.ts (11 pruebas).
  **Decisiones tomadas:** el script oculta la img y muestra el canvas solo si getContext funciona. Con reduced-motion se dibuja un fotograma (t=0) y no hay rAF; se reacciona en caliente al cambio. Bucle activo solo si visible (IntersectionObserver) y !document.hidden. Densidad: 1 partícula por 1200 px2 (520 px da 220, tope). Móvil = viewport < 768. Colores como constantes RGB con comentario del token. Semilla fija para resultados estables. El wrapper usa shadow-hologram y rounded-pill; no se usó Card.
  **Verificación ejecutada:** npm run test → 3 archivos, 26 pruebas OK · npm run lint → sin errores · npm run check → 0 errors/0 warnings/0 hints · npm run build → OK · peso del script bundleado y minificado con vite: 4101 B, 1767 B gzip (el componente aún no se usa en ninguna página, así que se midió el script aislado). No verificado visualmente en navegador ni en móvil emulado (no hay página que lo use todavía; T-009).
  **Criterios de aceptación:** todos marcados; los de fluidez en móvil emulado y el corte real de rAF fuera de viewport están implementados pero pendientes de comprobar en navegador cuando exista el Hero.
  **Dependencias añadidas:** ninguna.
  **Dudas, bloqueos o pendientes:** el componente asume que el contenedor padre le da ancho; el tamaño máximo 520 px es propio. Sin afirmaciones de contenido sobre Jarvis (no hay texto visible).
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado: `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 26/26 (11 de `particles`: cantidad por área, máximos 220/90, determinismo con semilla, rangos, casos 0/negativo/NaN); build OK. Prueba temporal en Chromium con página y spec borrados: el canvas se muestra y el respaldo se oculta; hay más de 500 píxeles pintados; `requestAnimationFrame` se invoca mientras es visible y deja de invocarse al salir del viewport; con `prefers-reduced-motion: reduce` hay 0 llamadas a `requestAnimationFrame` y se dibuja un fotograma; sin JS se ve `logo.svg`. Peso medido en el HTML construido: hologram ≈ 1,5 KB gzip (límite 6 KB). Componente decorativo con `aria-hidden="true"`, colores como constantes RGB con su token comentado, sin dependencias.
  Criterios: 6/6
  Hallazgos: sin bloqueantes. (1) `max-w-[520px]` es un valor arbitrario (el Brief fija 520 px): aceptado. (2) El script sale inline en el HTML: T-020 debe tenerlo en cuenta para la CSP. (3) La fluidez en móvil real queda para T-017/T-018.
- **Intentos de revisión:** 1

### T-009 · Sección Hero
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007, T-008
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-01, RNF-03, RNF-05
- **Descripción:** Implementar `src/sections/Hero.astro` según Brief §12.2 con datos de `src/data/hero.ts`: eyebrow, `h1` «Jarvis», eslogan del README, CTAs («Ver en GitHub» primario externo; «Cómo se instala» secundario a `#instalacion`), fila de etiquetas verificables (Next.js 16, OpenRouter, Windows), e integración de `HologramCore`. No añadir la etiqueta «Código abierto» hasta que el usuario confirme la visibilidad del repositorio (PRD Q-01). Layout: una columna en móvil (holograma arriba), dos en ≥ 1024 px.
- **Zonas permitidas:** `src/sections/Hero.astro`, `src/data/hero.ts`
- **Criterios de aceptación:**
  - [ ] En 375×667 y 1440×900 se ven título, eslogan y CTA principal sin scroll
  - [ ] El `h1` es único y dice «Jarvis»
  - [ ] El CTA principal apunta a `githubUrl` con `rel="noopener noreferrer"`
  - [ ] No hay scroll horizontal de 320 a 1920 px
  - [ ] Todas las etiquetas están respaldadas por el README
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** Hero con eyebrow, h1 «Jarvis», eslogan, dos CTAs, etiquetas y HologramCore; una columna en móvil (holograma arriba, reducido) y dos en lg.
  **Archivos:** `src/sections/Hero.astro`, `src/data/hero.ts` (reutiliza `SITE.name/tagline/githubUrl`).
  **Decisiones:** holograma limitado por un wrapper (170 px móvil, 260 px sm, 520 px lg) para que título, eslogan y CTA entren en 375×667; padding superior por la cabecera fija. Sin etiqueta «Código abierto» (Q-01).
  **Verificación ejecutada:** `npm run lint` OK · `npm run build` OK · `npm run check` 1 error en `src/sections/Install.astro:33` (ajeno, otra instancia). Sin prueba visual en navegador: la visibilidad sin scroll en 375×667/1440×900 y la ausencia de scroll horizontal NO están verificadas.
  **Criterios:** implementados; los de viewport pendientes de comprobación en navegador (QA).
  **Dependencias añadidas:** ninguna.
  **Afirmaciones a contrastar:** «Asistente de voz · en español · en tu PC» (eyebrow del Brief; el README respalda voz y PC, «en español» viene del Brief/memoria, no literal del README). Next.js 16, OpenRouter y Windows están en el README.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Hero: en 375×667 y 1440×900 el `h1`, el eslogan y el CTA «Ver en GitHub» quedan dentro de la primera pantalla (medido en Chromium, Firefox, WebKit y móvil); capturas revisadas a ojo (holograma, CTAs y etiquetas correctos). El CTA primario apunta a `https://github.com/wilrd14/Jarvis` con `rel`; etiquetas Next.js 16 / OpenRouter / Windows respaldadas por el README; sin «Código abierto» (Q-01 abierta). Hallazgos: sin bloqueantes. (1) El eyebrow «en español» no figura literal en el README (viene del Brief y del propio producto): aceptado. (2) Con `font-display: swap` el título aparece un instante con la fuente de respaldo: la precarga de fuentes del hero queda para T-019/T-020.
- **Intentos de revisión:** 1

### T-010 · Secciones Voz y Órdenes instantáneas
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-02, RF-03, RNF-10
- **Descripción:** Implementar `Voice.astro` (Brief §12.3, 4 tarjetas + maqueta HTML/CSS de burbujas con onda decorativa) e `Instant.astro` (Brief §12.4, badge «Sin IA · sin coste» y 8 mini-tarjetas) con datos en `src/data/voice.ts` e `src/data/instant.ts`. Textos tomados del README, sección «Conversación por voz» y «Órdenes instantáneas».
- **Zonas permitidas:** `src/sections/Voice.astro`, `src/sections/Instant.astro`, `src/data/voice.ts`, `src/data/instant.ts`
- **Criterios de aceptación:**
  - [x] `#voz` contiene los 4 puntos de RF-02 y `#instantaneas` las 8 órdenes de RF-03
  - [x] Ninguna afirmación se aparta del README
  - [x] Las maquetas decorativas están marcadas `aria-hidden="true"`
  - [x] Rejillas de 1/2/3-4 columnas según el Brief §8 sin desbordes
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** `Voice.astro` (4 tarjetas + maqueta de burbujas con onda) e `Instant.astro` (badge y 8 mini-tarjetas), con datos en `src/data/voice.ts` e `instant.ts`.
  **Archivos:** `src/sections/Voice.astro`, `src/sections/Instant.astro`, `src/data/voice.ts`, `src/data/instant.ts`.
  **Decisiones:** Voz: 1 col, 2 col desde sm, y en lg tarjetas + maqueta (3fr/2fr). Instantáneas: 1/2/4 columnas (1 en móvil, 2 en sm, 4 en lg). Maqueta con `aria-hidden="true"`; la onda son barras con altura en porcentaje. Los títulos h3 de las tarjetas respetan la jerarquía.
  **Verificación ejecutada:** `npm run lint` OK (en mi última ejecución); `npm run build` OK; `npm run check` 1 error ajeno en `src/sections/Install.astro` (otra instancia en curso), ninguno en mis archivos. Prettier aplicado. No probado en navegador a distintos anchos.
  **Criterios:** 4/4 implementados; el desborde responsive no verificado visualmente.
  **Dependencias añadidas:** ninguna.
  **Dudas / afirmaciones sin respaldo literal:** títulos y entradillas de sección ("Hablas, Jarvis responde en voz alta", "Lo sencillo se resuelve al momento", "se ejecutan en local: no usan IA y no cuestan nada") son redacción mía; "en local" se deduce de "sin IA, sin coste" y del README (corre en tu PC). Maqueta: texto "Jarvis, ¿qué hora es?" y "Respondiendo en voz alta…" es ilustrativo (hora y fecha es orden instantánea del README); la etiqueta «Ilustración de una conversación» lo indica. Los iconos usados existen todos (mic, wave, chat, bolt, volume, folder, camera, lock, timer, note, clock, hand).
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Voz: 4 tarjetas de RF-02 con texto del README y maqueta de burbujas con `aria-hidden="true"` y rótulo «Ilustración de una conversación». Instantáneas: badge «Sin IA · sin coste» y las 8 órdenes de RF-03. Hallazgos: sin bloqueantes. (1) Titulares e intros son redacción propia sin afirmaciones nuevas («en local» está respaldado por «órdenes locales» del README, apartado Costes). (2) Las alturas `style="height: N%"` de las barras de onda son decorativas: aceptado.
- **Intentos de revisión:** 1

### T-011 · Secciones Acciones y Documentos
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-04, RF-05, RNF-10
- **Descripción:** Implementar `Actions.astro` (Brief §12.5: capacidades agrupadas, destacada «¿Qué estoy viendo?», maqueta de la tarjeta de confirmación) y `Documents.astro` (Brief §12.6: 8 formatos como badges, tres puntos y maqueta de la tarjeta de coste) con datos en `src/data/actions.ts` y `src/data/documents.ts`. Fuente: README, secciones «Acciones sobre tu PC», «Entiende tu pantalla» y «Documentos».
- **Zonas permitidas:** `src/sections/Actions.astro`, `src/sections/Documents.astro`, `src/data/actions.ts`, `src/data/documents.ts`
- **Criterios de aceptación:**
  - [ ] `#acciones` incluye todas las capacidades de RF-04 y la mención de que las acciones con efecto piden confirmación
  - [ ] `#documentos` muestra los 8 formatos, la carpeta `Documentos\Jarvis` sin sobrescribir y el coste estimado
  - [ ] Sin cifras de coste inventadas en las maquetas (usar marcadores visibles como «~ estimado»)
  - [ ] Maquetas decorativas con `aria-hidden="true"`
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  - Archivos: `src/sections/Actions.astro`, `src/sections/Documents.astro`, `src/data/actions.ts`, `src/data/documents.ts`.
  - Actions: 3 grupos (Comunicación, Sistema, Tiempo) en tarjetas con iconos, tarjeta destacada «¿Qué estoy viendo?», maqueta de confirmación `aria-hidden` y nota «Las acciones con efecto piden confirmación».
  - Documents: 8 badges, tres puntos (carpeta `Documentos\Jarvis` sin sobrescribir, IA o dictado, coste estimado) y maqueta de coste `aria-hidden` con «Sin coste» / «Máximo ~ estimado» (sin cifras).
  - Verificación: `npm run lint` OK; `npm run build` OK; `npm run check` 1 error ajeno: `src/sections/Install.astro:33` (`[...step.commands]` puede ser undefined; es de otra tarea). Mis archivos sin errores.
  - Dudas/afirmaciones sin respaldo literal en el README: botones de maqueta «Confirmar»/«Cancelar» y el texto «Descripción de la acción…» son ilustrativos; «Dicta lo que necesitas y Jarvis genera el archivo en el formato que prefieras» es redacción derivada; grupos «Comunicación/Sistema/Tiempo» vienen del Brief; «Notas», «Capturas» y «Volumen» están en el README (acciones). Iconos: no faltó ninguno (el icono `file` repetido para Word/PDF, `note` para Markdown/Texto y `sheet` para Excel/CSV).
  - Sin dependencias nuevas. No se escribieron pruebas (la tarea no las pide).
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Acciones: todas las capacidades de RF-04 en tres grupos, tarjeta «¿Qué estoy viendo?» y maqueta de confirmación con `aria-hidden`; frase de que las acciones con efecto piden confirmación. Documentos: 8 formatos (contados en el DOM), carpeta `DocumentosJarvis` sin sobrescribir y coste estimado; maqueta sin cifras («Sin coste» / «Máximo ~ estimado»). Hallazgos: sin bloqueantes. Los botones «Confirmar/Cancelar» y las etiquetas «Maqueta ilustrativa» son ilustrativos y están rotulados; los nombres de grupo vienen del Brief §12.5.
- **Intentos de revisión:** 1

### T-012 · Secciones Skills/Memoria y Móvil
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007
- **Prioridad:** Media
- **Requisitos que cubre:** RF-06, RF-07, RNF-10
- **Descripción:** Implementar `SkillsMemory.astro` (Brief §12.7, dos columnas, 7 skills nombradas) y `Mobile.astro` (Brief §12.8, `Steps` de 3 pasos y aviso) con datos en `src/data/skills.ts` y `src/data/mobile.ts`. Fuente: README, secciones «Skills», «Memoria a largo plazo» y «Usarlo desde el celular (Tailscale)».
- **Zonas permitidas:** `src/sections/SkillsMemory.astro`, `src/sections/Mobile.astro`, `src/data/skills.ts`, `src/data/mobile.ts`
- **Criterios de aceptación:**
  - [ ] `#skills` nombra las 7 skills y las dos propiedades de la memoria (desactivable, borrable)
  - [ ] `#movil` muestra 3 pasos y el aviso de que el PC debe estar encendido y las acciones se ejecutan en el PC
  - [x] Se aclara que Jarvis no se expone a internet
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  - Archivos: `src/sections/SkillsMemory.astro`, `src/sections/Mobile.astro`, `src/data/skills.ts`, `src/data/mobile.ts`. Nada fuera de zona.
  - SkillsMemory: dos tarjetas (Skills con 7 badges nombradas y nota «nunca se ejecuta código»; Memoria con «Se puede desactivar» y «Se puede borrar»). Mobile: `Steps` de 3 pasos, tarjeta «No se expone a internet» y tarjeta destacada con aviso (PC encendido y sin suspenderse; acciones se ejecutan en el PC).
  - Verificación: `npm run lint` OK; `npm run check` 0 errores (en una ejecución previa salió un error ajeno en Install.astro, ya resuelto por esa instancia); `npm run build` OK. Sin comprobación visual en navegador ni pruebas (no pedidas).
  - Correspondencia con el README: todo el texto sale de «Skills», «Memoria a largo plazo», «Usarlo desde el celular, en privado» y «Usarlo desde el celular (Tailscale)». Redacción derivada (no literal): títulos de sección y intros, «Instala Tailscale», «Ábrelo en el celular», y «solo tus dispositivos pueden abrirlo» (README: «solo tus dispositivos pueden abrirlo»). «127.0.0.1» viene de la sección de instalación/Tailscale.
  - Dudas: el Brief dice «dos columnas» y lo resolví en md+ (1 columna en móvil). `Card` no admite `role`, por eso el aviso es una tarjeta destacada sin `role="note"`. Iconos: no faltó ninguno. Sin dependencias nuevas.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Skills: las 7 skills nombradas, nota «nunca se ejecuta código de una skill», memoria «se puede desactivar» y «se puede borrar». Móvil: 3 pasos, aviso de PC encendido y sin suspenderse, acciones que se ejecutan en el PC, y «No se expone a internet» (127.0.0.1). Todo respaldado por las secciones «Skills», «Memoria» y «Usarlo desde el celular» del README. Hallazgos: sin bloqueantes. `Card` no admite `role`, así que el aviso es una tarjeta destacada sin `role="note"`: aceptado.
- **Intentos de revisión:** 1

### T-013 · Secciones Seguridad y Costes
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-08, RF-09, RNF-10
- **Descripción:** Implementar `Security.astro` (Brief §12.9: 6 tarjetas con frase clara y frase técnica secundaria en mono) y `Costs.astro` (Brief §12.10: tres bloques, sin precios) con datos en `src/data/security.ts` y `src/data/costs.ts`. Fuente: README, secciones «Seguridad» y «Costes». Explicar términos técnicos en lenguaje comprensible sin cambiar su significado.
- **Zonas permitidas:** `src/sections/Security.astro`, `src/sections/Costs.astro`, `src/data/security.ts`, `src/data/costs.ts`
- **Criterios de aceptación:**
  - [ ] `#seguridad` contiene las 6 garantías de RF-08
  - [ ] `#costes` contiene las 5 ideas de RF-09 y ningún precio
  - [ ] Cada afirmación es verificable en el README (el reporte lista la correspondencia)
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** `Security.astro` (6 tarjetas: icono, título claro, explicación y frase técnica en mono) y `Costs.astro` (3 bloques) con `Card as="li"`, `SectionHeading` e `Icon`; textos en `src/data/`.
  **Archivos creados/modificados:** `src/data/security.ts`, `src/data/costs.ts` (datos y cabeceras), `src/sections/Security.astro`, `src/sections/Costs.astro`.
  **Decisiones tomadas:** frase técnica en `text-turquoise` (no `text-ghost`) para asegurar contraste. Iconos existentes: server, shield, check, key, lock, folder, coin, bolt, timer.
  **Verificación ejecutada:** `npm run lint` → sin errores. `npm run check` → 1 error ajeno: `src/sections/Install.astro:33` (T-014, `[...step.commands]` posiblemente undefined); ninguno en mis archivos. `npm run build` → OK, 1 página. Prettier aplicado a mis 4 archivos.
  **Correspondencia con el README (Seguridad):** solo loopback → «Servidor solo en loopback»; Host/origen/tipo de contenido, CSRF y DNS rebinding → bullet 1; lista cerrada, confirmación, firma HMAC, el portapapeles nunca ejecuta solo → bullet 2; API keys fuera de logs/repo/procesos hijos → bullet 3; `.ts.net`, scrypt, cookie HttpOnly/Secure/SameSite=Strict, 5 intentos, Ajustes/PIN solo desde el PC → bullet 4; `Documentos\Jarvis` sin sobrescribir → bullet 5. (Costes): OpenRouter y pago por uso, órdenes locales gratis, saldo real, tope mensual con bloqueo, modelo rápido y caché de voz reducen gasto → párrafo «Costes». Sin precios.
  **Afirmaciones no respaldadas literalmente por el README (paráfrasis para lenguaje claro):** «no se abre a tu red / solo responde a tu propio PC» (explicación de loopback, pedida por el Brief §12.9); «Desde el celular solo se entra con tu PIN» (el README habla de acceso remoto con PIN); «Pagas solo lo que usas» y «tú controlas el límite» (derivado de pago por uso y tope mensual); «Tus claves no salen del servidor» (README: «no salen del servidor»). Titular «Pensado para que tu equipo siga siendo tuyo» es copy editorial, no una afirmación técnica.
  **Criterios de aceptación:** [x] 6 garantías en #seguridad [x] 5 ideas de costes en #costes, sin precios [x] correspondencia con el README listada.
  **Dependencias añadidas:** ninguna.
  **Dudas, bloqueos o pendientes:** el error de `check` en Install.astro pertenece a T-014; el titular editorial de Seguridad puede revisarse.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Seguridad: 6 tarjetas con frase clara y frase técnica en mono (correspondencia punto por punto con el apartado «Seguridad» del README). Costes: 3 bloques que cubren las 5 ideas de RF-09 y sin precios (comprobado: no hay importes ni monedas). Hallazgos: sin bloqueantes. (1) El titular «Pensado para que tu equipo siga siendo tuyo» es copy editorial, no afirmación técnica. (2) La frase técnica usa `text-turquoise` en lugar de `text-ghost` por contraste: correcto. Segunda revisión: el titular «Otras webs no pueden darle órdenes» prometía más que el README («para frenar CSRF y DNS rebinding desde otras webs»); lo cambié yo a «Frena las órdenes que llegan desde otras webs» (corrección trivial de contenido).
- **Intentos de revisión:** 1

### T-014 · Secciones Instalación y FAQ
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-005, T-007
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-10, RF-14, RNF-03, RNF-10
- **Descripción:** Implementar `Install.astro` (Brief §12.11, `Steps` con `CodeBlock`: `npm install`, `npm run app:install`, pegar API key en Ajustes; nota de Windows y Smart App Control) y `Faq.astro` (Brief §12.12, acordeón con `<details>`, ≥ 6 preguntas de RF-14) con datos en `src/data/install.ts` y `src/data/faq.ts`. Las respuestas que el README no cubre (p. ej. funcionamiento sin internet, Mac/Linux) deben decir con honestidad lo que se sabe, y el reporte las lista para que el usuario confirme.
- **Zonas permitidas:** `src/sections/Install.astro`, `src/sections/Faq.astro`, `src/data/install.ts`, `src/data/faq.ts`
- **Criterios de aceptación:**
  - [x] Cada comando tiene un botón «Copiar» funcional
  - [x] Los pasos coinciden con el README («Instalación en Windows»)
  - [x] El FAQ tiene ≥ 6 preguntas y se opera con teclado
  - [x] Las respuestas no inventan capacidades; las dudosas están listadas en el reporte
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  - Archivos: `src/data/install.ts`, `src/data/faq.ts`, `src/sections/Install.astro`, `src/sections/Faq.astro`.
  - Verificación: lint 0 errores; check 0 errores/0 warnings; build OK (1 página). Prettier aplicado. Sin pruebas e2e en esta tarea; copiado y teclado no probados en navegador (usa `CodeBlock` y `<details>` nativos).
  - Install: lista `ol` propia en la sección (no `Steps`, que no admite contenido por paso). 3 pasos + nota Windows/Smart App Control + comandos opcionales de autoarranque, cada comando en `CodeBlock` con «Copiar».
  - FAQ: 7 preguntas con `<details>`/`<summary>` (6 de RF-14 + celular); chevron = `arrow-right` rotado al abrir, con `motion-reduce`.
  - Dudas para confirmar con el usuario (el README no las respalda del todo):
    1. «¿Necesita internet?»: se afirma que respuestas y voz pasan por OpenRouter (README: «Todo pasa por OpenRouter») y que las órdenes locales no usan IA; se admite que no se documenta el modo sin conexión.
    2. «¿Mis datos salen de mi PC?»: «el contenido se envía a OpenRouter para procesarse» es inferencia de «Todo pasa por OpenRouter»; el README no detalla qué se envía.
    3. «¿Qué es OpenRouter?»: el README no lo define; la respuesta se limita a «servicio por el que pasan los modelos, pago por uso, requiere API key».
    4. Mac/Linux: respuesta honesta de que solo se documenta Windows.
    5. Paso 1: el README no da comando `git clone`; se dice «desde la carpeta del proyecto de Jarvis» sin inventar la URL de clonado. Paso 2 «Compila y crea el acceso directo» viene del comentario del README.
  - Iconos/tokens: no faltó ninguno.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Instalación: pasos `npm install`, `npm run app:install` y pegar la API key en Ajustes, nota de Windows/Smart App Control y comandos de autoarranque; 4 botones «Copiar» y el primero copia `npm install` al portapapeles (Chromium). FAQ: 7 preguntas con `<details>`; Enter abre y Espacio cierra con foco visible. Corrección trivial hecha por el orquestador: `wrap-anywhere` en el párrafo de los pasos de `Install.astro`, porque `%APPDATA%Jarvissettings.json` causaba 351 px de ancho a 320 px. Hallazgos: sin bloqueantes. (1) Respuestas del FAQ que el README no cubre y que el usuario debe confirmar: «¿Necesita internet?» (modo sin conexión no documentado), «¿Mis datos salen de mi PC?» (inferido de «Todo pasa por OpenRouter»), «¿Qué es OpenRouter?» (el README no lo define) y Mac/Linux (no hay información); el paso 1 no inventa un `git clone`. (2) Usa una `<ol>` propia porque `Steps` no admite bloque de código: mejora posible. (3) Pulido pendiente en pantallas muy estrechas: ver T-022.
- **Intentos de revisión:** 1

### T-015 · Secciones Autor y CTA final
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-007
- **Prioridad:** Media
- **Requisitos que cubre:** RF-11, RF-16
- **Descripción:** Implementar `Author.astro` (Brief §12.13) y `FinalCta.astro` (Brief §12.14) con datos en `src/data/author.ts`. Texto del autor tomado del pie del README: «Hecho por Williams Villavizar: desarrollador web en Santo Domingo, República Dominicana», con enlace a `https://wilrd14.dev`.
- **Zonas permitidas:** `src/sections/Author.astro`, `src/sections/FinalCta.astro`, `src/data/author.ts`
- **Criterios de aceptación:**
  - [ ] `#autor` enlaza al portafolio con `rel="noopener noreferrer"`
  - [ ] El CTA final enlaza a `githubUrl` y a `#instalacion`
  - [x] La página completa tiene ≥ 2 apariciones del CTA a GitHub (hero, cabecera, CTA final y pie cuentan)
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  **Resumen:** `Author` (tarjeta con nombre, rol y botón «Ver portafolio» externo) y `FinalCta` (titular, «Ver en GitHub» y «Cómo se instala» → `#instalacion`), con textos en `src/data/author.ts` y URLs desde `SITE`.
  **Archivos:** `src/sections/Author.astro`, `src/sections/FinalCta.astro`, `src/data/author.ts` (nuevo, exporta `AUTHOR` y `FINAL_CTA`).
  **Verificación:** `npm run lint` sin errores; `npm run build` OK; `npm run check` da 2 errores, ambos ajenos (`Mobile.astro` prop `role` en `Card`; `Install.astro` `lines={[...step.commands]}`), ninguno en mis archivos. `npm run format` sobre mis 3 archivos: sin cambios.
  **Veracidad:** el nombre, rol y ciudad proceden literalmente del pie del README. El texto del CTA («Asistente de voz personal que corre en tu propio PC») procede de la cabecera del README. Sin afirmaciones no respaldadas.
  **Notas:** el CTA a GitHub aparece en CTA final (y en cabecera/pie por T-006). Los enlaces externos usan `rel="noopener noreferrer"` vía `Button external`. Sin iconos ni tokens faltantes.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0/0/0; `npm run test` 29/29; `npm run build` OK; `prettier --check` OK; sin cambios en CHANGELOG ni memory. Prueba temporal en navegador sobre la página real (spec borrado): sin scroll horizontal a 320, 375, 768, 1024 y 1440 px (Chromium, Firefox, WebKit y móvil), un solo `h1`, jerarquía sin saltos, 0 peticiones fuera del mismo origen, enlaces `target="_blank"` con `rel="noopener noreferrer"`.
  Autor: «Hecho por Williams Villavizar» con rol y ciudad literales del pie del README y enlace a `https://wilrd14.dev` con `rel="noopener noreferrer"` (comprobado en el navegador). CTA final: enlaza a `githubUrl` y a `#instalacion` (comprobado). La página tiene ≥ 2 enlaces al GitHub (cabecera, Hero, CTA y pie). Hallazgos: sin bloqueantes.
- **Intentos de revisión:** 1

---

## Fase 3 — Calidad y pulido

### T-016 · Pruebas e2e de contenido, navegación y responsive
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-009, T-010, T-011, T-012, T-013, T-014, T-015
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-01 a RF-16, RNF-05, RNF-08, OBJ-01, OBJ-02
- **Descripción:** Escribir las pruebas Playwright en `tests/e2e/` que cubran, como mínimo, una comprobación por cada RF «Must»: anclas y contenido clave de cada sección, CTAs a GitHub (≥ 2), menú móvil por teclado, resaltado de navegación al hacer scroll, copiar (con permisos concedidos y con el portapapeles denegado), acordeón del FAQ, y ausencia de scroll horizontal en 320, 375, 768, 1024 y 1440 px. Ejecutar en Chromium, Firefox y WebKit. Documentar cualquier defecto encontrado con la plantilla de reporte (no corregir código de producción).
- **Zonas permitidas:** `tests/e2e/`, `tests/unit/`
- **Criterios de aceptación:**
  - [x] Existe al menos una prueba por cada RF «Must» y la tabla de trazabilidad RF → prueba está en el reporte
  - [x] Las pruebas pasan en los 3 navegadores y el perfil móvil, o los fallos están documentados como defectos con severidad
  - [x] Hay comprobación de que no existe scroll horizontal en los 5 anchos
  - [x] Las pruebas usan roles accesibles o `data-*`, nunca clases de Tailwind
- **Verificación (comandos):** `npm run build && npm run test:e2e` · `npm run test`
- **Reporte del subagente:**
**Resumen:** 4 specs Playwright nuevos (65 pruebas por navegador; 260 ejecuciones en chromium, firefox, webkit y mobile). Resultado final: 260/260 pasan. No se encontraron defectos de producción; una prueba falló por una peculiaridad de WebKit (Tab no recorre enlaces) y se corrigió en la prueba.
**Archivos creados/modificados:**
- tests/e2e/content.spec.ts: anclas, contenido por RF, CTAs GitHub, FAQ, veracidad, metadatos.
- tests/e2e/navigation.spec.ts: menú móvil por teclado, cabecera fija, resaltado al hacer scroll.
- tests/e2e/copy.spec.ts: copiar (ok, denegado, sin API, reintento, teclado, sin JS).
- tests/e2e/responsive.spec.ts: sin scroll horizontal en 320/375/768/1024/1440, hero sin scroll, objetivos táctiles >= 44 px, meta viewport.
**Decisiones tomadas:** el portapapeles se sustituye por un doble (addInitScript) en todos los navegadores porque los permisos solo se conceden en Chromium; los anchos se fijan con setViewportSize para que corran igual en todos los proyectos; en el test de Esc se da foco explícito al enlace (WebKit no incluye enlaces en Tab).
**Trazabilidad RF -> prueba (archivo):** RF-01 content (Hero) + responsive (sin scroll); RF-02..RF-09 content (una prueba por sección); RF-10 content (Instalación) + copy; RF-11 content (autor y pie); RF-12 navigation; RF-13 content (metadatos básicos; el resto es de T-019); RF-14 content (FAQ x3); RF-16 content (CTA final); OBJ-01 content (>= 2 CTAs a GitHub); RNF-05/RNF-08 responsive. RF-15 queda para T-017.
**Verificación ejecutada:** npm run build && npx playwright test -> 259 pasan, 1 fallo (WebKit, Esc, artefacto de la prueba); tras corregirlo, navigation: 56/56. npm run test -> 70/70. npm run lint -> sin errores.
**Criterios de aceptación:** [x] una prueba por RF Must y tabla incluida; [x] pasan en 3 navegadores y móvil; [x] sin scroll horizontal en 5 anchos; [x] solo roles accesibles, ids de ancla y data-* (sin clases Tailwind).
**Dependencias añadidas:** ninguna.
**Dudas, bloqueos o pendientes:** (1) Observación, no defecto: RF-11 del PRD dice que los enlaces del pie abren en la misma pestaña, pero Footer/Button usan target="_blank" con rel="noopener noreferrer"; las pruebas solo exigen rel seguro. El orquestador decide si se corrige el PRD o el código (severidad baja). (2) Las pruebas de contenido usan textos literales de src/data: si se reescribe el copy hay que actualizarlas. (3) La verificación contra el README se limita a la ausencia de «código abierto»/precios; la revisión de veracidad sigue siendo del orquestador.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `npm run lint` 0 errores · `npm run check` 0/0/0 · `npm run test` 70/70 · `npm run build` OK · `npx playwright test` completo tras el último cambio: 260/260 (chromium, firefox, webkit, mobile). Sin clases de Tailwind en selectores; solo roles, ids y `data-*`.
  Criterios: 4/4 cumplidos.
  Hallazgos:
  1. RF-11 (PRD) dice «misma pestaña» en los enlaces del pie, pero el código usa `target="_blank"` con `rel="noopener noreferrer"`. Severidad baja, no bloquea. Pendiente de decidir si se ajusta el PRD o el código.
- **Intentos de revisión:** 1

### T-017 · Auditoría de accesibilidad y movimiento reducido
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-016
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-03, RNF-04, RF-15
- **Descripción:** Pruebas con `@axe-core/playwright` en escritorio y móvil (0 violaciones WCAG 2.1 AA), recorrido completo por teclado (orden de tabulación, foco visible, sin trampas, Esc en el menú), un solo `h1`, landmarks, y emulación de `prefers-reduced-motion: reduce` verificando que el canvas no anima (sin `requestAnimationFrame` activo) y no hay transiciones largas. Reportar defectos con severidad.
- **Zonas permitidas:** `tests/e2e/`
- **Criterios de aceptación:**
  - [x] axe reporta 0 violaciones en escritorio y móvil, o cada una está documentada con severidad y ubicación
  - [x] La prueba de teclado recorre todos los elementos interactivos y verifica foco visible
  - [x] La prueba de `reduced-motion` demuestra que no hay animación del holograma
- **Verificación (comandos):** `npm run build && npm run test:e2e`
- **Reporte del subagente:**
  - **Archivo creado:** `tests/e2e/a11y.spec.ts` (único; no se tocó `src/`).
  - **Cobertura:** axe WCAG 2.0/2.1 A y AA en escritorio, móvil, menú móvil abierto, movimiento reducido y FAQ desplegado; un solo `h1` y jerarquía sin saltos; landmarks (banner, main, contentinfo, navs con nombre único); `lang`, título, `alt`; foco visible en todos los interactivos visibles (escritorio y móvil); recorrido con Tab (sin trampas, Shift+Tab); Esc en el menú; enlaces del panel cerrado no alcanzables; FAQ con Enter/Espacio; RF-15: control con animación (rAF y lienzo cambian), `reduce` sin llamadas a rAF y lienzo idéntico, fotograma estático pintado, cambio de preferencia en caliente, transiciones/animaciones ≤ 0,4 s, `scroll-behavior` no suave.
  - **Resultado:** `npm run build` OK; suite completa `npx playwright test --workers=2`: 360 pasan, 4 omitidas (WebKit, Tab no incluye enlaces), 0 fallos. Defectos encontrados: ninguno (axe 0 violaciones en todos los escenarios).
  - **Notas:** con 4 trabajadores en paralelo Firefox da timeouts por carga (error de cierre de contexto, no de la página); usar `--workers=2`. Un servidor `astro preview` huérfano bloqueó el arranque una vez; se detuvo con `npx astro preview stop`. No existe enlace «saltar al contenido»: esa prueba queda condicionada a que exista (hoy se omite dinámicamente); no es requisito del PRD citado. Sin dudas pendientes.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `npm run build` OK · `npx playwright test --workers=2` completo: 360 pasan, 4 omitidas (solo pruebas de Tab en WebKit), 0 fallos · `npm run lint` sin errores. Prueba del enlace «Saltar al contenido» (`BaseLayout.astro:71`) ejecutada y verde en Chromium, Firefox y móvil.
  Criterios: cumplidos (axe sin violaciones en 5 estados, teclado, RF-15 con `requestAnimationFrame` y lienzo estático bajo `reduce`).
  Hallazgos:
  1. El subagente afirmó que no existe enlace «Saltar al contenido»; sí existe y la prueba lo cubre. Sin acción. Con más de 2 workers Firefox da timeouts de carga (entorno), usar `--workers=2`.
- **Intentos de revisión:** 1

### T-018 · Pruebas de rendimiento y privacidad
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-016
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-01, RNF-02, RNF-06, OBJ-03
- **Descripción:** (1) Prueba que registra todas las peticiones de red al cargar `/` y falla si alguna sale del mismo origen; verifica además que no se establecen cookies ni `localStorage`. (2) Script de presupuesto (`tests/perf/budget.mjs`) que mide el JS total de `dist/` en gzip y falla por encima de 60 KB. (3) Ejecutar Lighthouse (móvil) contra `npm run preview` y reportar las cuatro puntuaciones, LCP, CLS y TBT; añadir un script `npm run perf` si es viable sin dependencias pesadas (si necesita `lighthouse`, justificarlo en el reporte).
- **Zonas permitidas:** `tests/`, `package.json` (solo scripts y devDependencies de pruebas)
- **Criterios de aceptación:**
  - [x] La prueba de red confirma que solo hay peticiones al mismo origen y que no hay cookies
  - [x] El presupuesto de JS ≤ 60 KB gzip se verifica automáticamente
  - [x] El reporte incluye las puntuaciones de Lighthouse móvil y señala las que estén por debajo de 95
- **Verificación (comandos):** `npm run build && npm run test:e2e` · `node tests/perf/budget.mjs`
- **Reporte del subagente:**
  - Archivos: `tests/e2e/privacy.spec.ts` (nuevo), `tests/perf/budget.mjs` (nuevo), `tests/perf/lighthouse.mjs` (nuevo), `package.json` (script `perf`). Sin tocar `src/`.
  - Privacidad: peticiones solo al mismo origen, sin cookies (contexto y `document.cookie`), `localStorage`/`sessionStorage` vacíos y sin `Set-Cookie`; 8/8 en los 4 proyectos. Suite e2e completa: 333 pasadas, 4 omitidas, 0 fallos (antes de añadir lint-fix menor a los scripts).
  - Presupuesto JS: 2,79 KB gz en total (3 scripts en línea; ningún .js en dist/) frente a 60 KB. Cuenta .js y `<script>` en línea; sale con 1 si se supera y con 2 si falta `dist/`.
  - Lighthouse móvil (v13, `npm run perf`, usa `npx --yes lighthouse@13` bajo demanda, NO es dependencia del proyecto; usa el Chromium de Playwright y 127.0.0.1 porque con localhost Chrome mostraba un interstitial): 3 ejecuciones. Rendimiento 69 (1.ª, ejecución en frío con descarga de npx: LCP 2,47 s, TBT 1628 ms) y 98 y 98 (LCP 1,68-1,71 s, TBT 0 y 116 ms); Accesibilidad 100, Buenas prácticas 100, SEO 100; CLS 0,001. Solo la 1.ª ejecución quedó por debajo de 95 y por TBT; la considero ruido de entorno, pero conviene repetir en una máquina idle/CI antes de publicar.
  - Defectos: ninguno. Dudas: si se quiere un `perf` en CI habrá que añadir `lighthouse` como devDependency (pesada) o dejar npx.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `node tests/perf/budget.mjs` → 2,79 KB gz de 60 KB (exit 0) · suite e2e completa (incluye `privacy.spec.ts`) 360 pasan, 0 fallos · lint y 70 tests unitarios OK. Sin cambios en `src/`; `package.json` solo añade el script `perf`.
  Criterios: 3/3 cumplidos.
  Hallazgos:
  1. Lighthouse móvil: 98 en 2 de 3 ejecuciones; la primera (69) coincidió con la descarga de npx. Repetir en T-021 en máquina sin carga. `lighthouse` queda fuera de devDependencies (decidir si se quiere en CI).
- **Intentos de revisión:** 1

### T-022 · Pulido responsivo en pantallas estrechas (CodeBlock y pasos)
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-014
- **Prioridad:** Media
- **Requisitos que cubre:** RNF-05, RF-10
- **Origen:** hallazgo del orquestador al revisar T-014 (capturas a 320 px).
- **Descripción:** A 320 px el botón «Copiar» deja casi sin ancho al comando: solo se ven ~8 caracteres de `npm install` y de `npm run app:install` dentro de la caja (se pueden desplazar, pero cuesta leerlos). Además la columna del número de paso (`Steps` y la lista de `Install.astro`) reserva 64 px + 24 px de hueco y estrecha el texto a ~200 px. Ajustar: (1) `CodeBlock`: por debajo de ~480 px el botón pasa debajo del comando (a ancho completo o alineado a la derecha) y el comando usa todo el ancho; desde ese ancho se mantiene el diseño actual. (2) Reducir el tamaño y el hueco del número de paso en móvil (`Steps` y la lista de `Install.astro`), conservando 44 px de área táctil en el botón. Solo tokens, sin valores sueltos.
- **Zonas permitidas:** `src/components/CodeBlock.astro`, `src/components/Steps.astro`, `src/sections/Install.astro`
- **Criterios de aceptación:**
  - [ ] A 320 px y 375 px el comando de cada `CodeBlock` se ve completo si cabe (p. ej. `npm install`, `npm run app:install`) o, si no cabe, se desplaza dentro de su caja con el botón fuera de ella
  - [ ] El número de paso no reduce el texto por debajo de ~240 px a 320 px
  - [ ] Sin scroll horizontal de página de 320 a 1920 px
  - [ ] El botón «Copiar» mantiene área táctil ≥ 44×44 px y sigue copiando (con permiso y con portapapeles denegado)
  - [ ] Sin cambios visuales en ≥ 768 px
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build` · `npm run test:e2e`
- **Reporte del subagente:**
  - Cambios: `CodeBlock.astro` apila (columna) el botón bajo el comando por debajo de `sm` (640 px, el breakpoint por defecto; el Brief no define 480) con el botón a ancho completo y 44 px de alto; desde `sm` vuelve al diseño anterior. `Steps.astro` e `Install.astro`: número `w-9 text-title-2` con hueco `gap-3` en móvil; desde `sm` `w-16 text-title-1 gap-6` (igual que antes). Solo tokens.
  - Medido con Playwright temporal (borrado): 320 px comando 206/254 px de ancho sin scroll (cabe completo), texto del paso 240 px; 375 px comando 261/309 px, texto 295 px; 640 y 1920 px botón 77x44 junto al comando, sin overflow de página en 320/375/640/1920. Copiar funciona (etiqueta «Copiado») a 320, 640 y 1920; a 375 una ejecución en paralelo leyó «Copiar» (carrera), repetida sola dio «Copiado». No probé portapapeles denegado (lógica de copy.ts intacta).
  - Verificación: lint OK, check 0 errores, build OK, test 70/70 (una ejecución intermedia falló 1 test por T-023 en curso; la repetición pasó), test:e2e 4/4.
  - Sin afirmaciones de contenido nuevas. Sin dudas. Nota: 640-767 px cambia respecto a antes solo en que sigue igual (sm=640); sin cambios visuales >= 640.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0 errores; `npm run test` 70/70; `npm run build` OK; `npm run test:e2e` 4/4; `prettier --check .` OK; sin cambios en CHANGELOG ni memory; sin archivos temporales en el árbol.
  Prueba temporal en Firefox y WebKit (spec borrado): de 320 a 1280 px sin scroll horizontal; los dos primeros comandos (`npm install`, `npm run app:install`) caben enteros sin desplazamiento; por debajo de 640 px el botón «Copiar» va debajo del comando a ancho completo; desde 640 px vuelve al lado; el botón mide ≥ 44×44 px; el texto del paso 1 mide ≥ 230 px a 320 px; copiar funciona a 375 px con permiso (el portapapeles contiene `npm install`) y con el portapapeles denegado muestra el error. En Chromium la geometría medida aparte es correcta (botón a 44 px bajo el comando, 261 px de ancho a 375 px): el fallo de mi prueba fue un artefacto del desplazamiento suave, no un defecto. Criterios: 5/5. Hallazgos: sin bloqueantes. (1) Usa el breakpoint `sm` (640 px) de Tailwind, no 480 px: aceptado, el Brief no define otro. (2) Cambia también `Steps.astro` y la lista de `Install.astro` (en zona permitida).
- **Intentos de revisión:** 1

### T-023 · Pruebas unitarias del contenido de src/data
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-015
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-10, RF-02 a RF-09, RF-14 (DEVELOPER-RULES §7; ARCHITECTURE §12)
- **Origen:** segunda revisión del orquestador de T-009 a T-015: ninguna de esas tareas incluyó pruebas de `src/data/` y las reglas piden Vitest para `data/` (cobertura ≥ 80 %).
- **Descripción:** Escribir pruebas Vitest en `tests/unit/` que importen los archivos de `src/data/` (`site, nav, hero, voice, instant, actions, documents, skills, mobile, security, costs, install, faq, author`) y comprueben forma y consistencia: ningún texto vacío; recuentos de los requisitos (4 puntos de voz, 8 órdenes instantáneas, 8 formatos de documento, 7 skills, 2 propiedades de memoria, 3 pasos móviles, 6 garantías de seguridad, 3 bloques de costes, ≥ 6 preguntas de FAQ y 4 comandos de instalación); URLs válidas (`githubUrl`, `portfolioUrl` con `https`); todos los `href` internos de `nav` y de los CTA apuntan a anclas que existen (`#inicio … #autor`, `#cta`); iconos de los datos existen en `ICONS`; ninguna cadena de `costs`, `documents` ni `actions` contiene importes ni monedas; ninguna cadena visible contiene «código abierto» (Q-01 abierta); `INSTALL` contiene exactamente los comandos del README (`npm install`, `npm run app:install`, `npm run app:autostart:on`, `npm run app:autostart:off`). Si hace falta medir cobertura y eso requiere `@vitest/coverage-v8`, justificarlo en el reporte. No modificar código de producción: si una prueba detecta un defecto, reportarlo con severidad.
- **Zonas permitidas:** `tests/unit/`, `package.json` (solo devDependencies de pruebas, si se justifican)
- **Criterios de aceptación:**
  - [ ] Hay pruebas para cada archivo de `src/data/` y todas pasan (`npm run test`)
  - [ ] Los recuentos de RF-02 a RF-09 y RF-14 están verificados
  - [ ] Las anclas internas, los iconos y las URLs están verificados
  - [ ] Se comprueba que no hay importes ni «código abierto» en el texto visible
  - [ ] Los defectos encontrados (si los hay) se reportan con severidad, sin corregir producción
- **Verificación (comandos):** `npm run test` · `npm run lint` · `npm run check`
- **Reporte del subagente:**
  - Archivos: `tests/unit/data/content.test.ts` (41 pruebas, un `describe` por cada archivo de `src/data/` más uno de consistencia transversal) y `tests/unit/data/helpers.ts`. No se tocó producción ni `package.json`.
  - Cubre: recuentos (4 voz, 8 instantáneas, 8 formatos, 7 skills, 2 propiedades de memoria, 3 pasos móviles, 6 garantías, 3 costes, FAQ >= 6, 4 comandos de instalación exactos), URLs https, anclas (se leen los `<section id>` reales de `src/sections/`), iconos contra `ICONS`, sin importes en costs/documents/actions, sin «código abierto»/open source, sin marcadores de relleno, sin cadenas vacías.
  - Resultados: `npm run test` 5 archivos / 70 pruebas OK; `npm run lint` sin errores; `npm run check` 0 errores, 0 avisos.
  - Defectos encontrados: ninguno. Cobertura no medida (no se añadió `@vitest/coverage-v8`; no era imprescindible).
  - Nota: `actions.ts` no tiene recuento fijo en el PRD, solo se comprueba que haya grupos con elementos.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0 errores; `npm run test` 70/70; `npm run build` OK; `npm run test:e2e` 4/4; `prettier --check .` OK; sin cambios en CHANGELOG ni memory; sin archivos temporales en el árbol.
  41 pruebas nuevas en `tests/unit/data/` (70 en total): recuentos de RF-02 a RF-09 y RF-14 (4/8/8/7/2/3/6/3/≥6), comandos de instalación exactos, anclas leídas de los `<section id>` reales (no de una lista copiada), URLs https válidas, iconos existentes en `ICONS`, sin importes ni «código abierto» ni cadenas vacías. Las pruebas comprueban comportamiento real y no son tautológicas. Corrección trivial hecha por el orquestador: `prettier --write` sobre `tests/unit/data/content.test.ts` (no cumplía `prettier --check`). Criterios: 5/5. Hallazgos: sin defectos en `src/data/`; cobertura no medida (no se añadió `@vitest/coverage-v8`; ningún criterio la exigía).
- **Intentos de revisión:** 1

---

## Fase 4 — Release

### T-024 · FAQ: aplicar las respuestas confirmadas por el usuario
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-014
- **Prioridad:** Media
- **Requisitos que cubre:** RF-14, RNF-10
- **Origen:** el usuario confirmó el 2026-10-26 las respuestas que el README no cubría.
- **Descripción:** Actualizar solo los textos de `src/data/faq.ts` con estas respuestas confirmadas, sin añadir afirmaciones nuevas (RNF-10): (1) «¿Necesita internet?»: sin conexión siguen funcionando las acciones locales, como abrir aplicaciones del PC; con internet puede hacer investigaciones; las respuestas y la voz que pasan por OpenRouter requieren conexión. Elimina la frase «La documentación no detalla…». (2) «¿Funciona en Mac o Linux?»: por ahora Jarvis solo funciona en Windows; quita el «no podemos asegurar». (3) «¿Qué es OpenRouter?»: una API key que da acceso a múltiples modelos de IA con una sola clave; cada persona usa su propia API key, de OpenRouter o la que prefiera, y la pega en Ajustes; se paga por uso. (4) «¿Cuánto cuesta?» y «¿Mis datos salen de mi PC?» se mantienen tal como están: el README dice «Todo pasa por OpenRouter y se paga por uso», y NO se afirma qué datos concretos viajan ni que el modelo se procese en local. (5) El paso 1 de instalación NO se toca: el usuario añadirá la instalación al README de Jarvis más tarde. Antes de escribir, contrasta cada frase con `C:/Users/willi/Code/Jarvis/README.md` (solo lectura); si algo del punto (1) a (3) contradice el README, no lo escribas y repórtalo.
- **Zonas permitidas:** `src/data/faq.ts`; y, solo si algún test aserta sobre los textos cambiados, los literales de esos tests en `tests/unit/` y `tests/e2e/` (cambio mínimo, sin añadir pruebas nuevas)
- **Criterios de aceptación:**
  - [ ] Las respuestas de «internet», «Mac o Linux» y «OpenRouter» reflejan lo confirmado y no contradicen el README
  - [ ] Ninguna respuesta afirma qué datos viajan a OpenRouter ni procesamiento local de las consultas al modelo
  - [ ] Sin precios ni «código abierto»; el paso 1 de instalación queda intacto
  - [ ] Sin scroll horizontal ni cambios de estructura; mismas 7 preguntas
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build` · `npx playwright test --workers=2`
- **Reporte del subagente:**
  - Actualizadas en `src/data/faq.ts` las respuestas de internet, Mac/Linux y OpenRouter según lo confirmado; «cuánto cuesta», «datos» y el paso 1 de instalación intactos; mismas 7 preguntas. Test e2e ajustado: literal `solo para Windows` -> `solo funciona en Windows` en `tests/e2e/content.spec.ts`.
  - Verificación: lint, check (0 errores), test (70 ok), build ok; playwright completo 356 ok antes del ajuste, con 4 fallos solo del literal cambiado; tras ajustarlo, content.spec pasa.
  - Aviso: el README no menciona «investigaciones» con internet ni «una API key de múltiples modelos / la que prefiera»; se escribió porque lo confirmó el usuario, pero el README no lo respalda. No hay contradicciones con el README.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `npm run lint` OK · `npm run check` 0/0 · `npm run test` 70/70 · `npm run build` OK · `npx playwright test --workers=2` completo: 360 pasan, 4 omitidas (WebKit), 0 fallos. Texto de `faq.ts` leído y contrastado con las respuestas del usuario y el README.
  Criterios: 4/4 cumplidos (7 preguntas; sin datos concretos a OpenRouter; paso 1 de instalación intacto).
  Hallazgos:
  1. Corrección trivial hecha por el orquestador: `prettier --write src/data/faq.ts` (la respuesta de Mac/Linux quedó en una línea).
  2. «Puede hacer investigaciones» y «la que prefiera» vienen del usuario, no del README (que no los dice); aceptado por confirmación expresa.
- **Intentos de revisión:** 1

### T-025 · FAQ: suavizar afirmaciones que el README no respalda (RNF-10)
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-024
- **Prioridad:** Media
- **Requisitos que cubre:** RF-14, RNF-10
- **Origen:** hallazgo de T-021 (RNF-10 parcial); el usuario decidió el 2026-10-26 suavizar el texto de la landing en lugar de ampliar el README de Jarvis.
- **Descripción:** En `src/data/faq.ts` quitar lo que el README de Jarvis no dice, sin añadir nada nuevo: (1) «¿Necesita internet?»: eliminar «Con internet, Jarvis también puede hacer investigaciones»; la respuesta queda en que las respuestas y la voz pasan por OpenRouter y por eso hace falta conexión, y que las órdenes instantáneas (volumen, abrir apps, capturas, temporizadores…) se resuelven en tu PC sin IA (texto ya respaldado por el README). (2) «¿Qué es OpenRouter?»: no definirlo como «una API key»; decir que es el servicio por el que pasan los modelos que usa Jarvis, que se paga por uso y que necesitas tu propia API key de OpenRouter, que pegas en Ajustes. Eliminar «o la que prefiera». (3) El resto del FAQ (incluida «Por ahora Jarvis solo funciona en Windows») no se toca. Contrasta cada frase con `C:/Users/willi/Code/Jarvis/README.md` (solo lectura).
- **Zonas permitidas:** `src/data/faq.ts`; y, solo si algún test aserta sobre los textos cambiados, los literales de esos tests en `tests/unit/` y `tests/e2e/` (cambio mínimo)
- **Criterios de aceptación:**
  - [x] Ninguna respuesta del FAQ menciona «investigaciones» ni «la que prefiera»
  - [x] Cada frase de «internet» y «OpenRouter» está respaldada por el README
  - [x] Mismas 7 preguntas; sin precios ni «código abierto»; paso 1 de instalación intacto
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build` · `npx playwright test --workers=2`
- **Reporte del subagente:**
  - Cambiado solo `src/data/faq.ts`: «¿Necesita internet?» ahora dice que respuestas y voz pasan por OpenRouter (hace falta conexión) y que las órdenes instantáneas (volumen, abrir apps, capturas, temporizadores) se resuelven en el PC sin IA y sin coste. «¿Qué es OpenRouter?»: servicio por el que pasan los modelos, de pago por uso, con tu propia API key de OpenRouter pegada en Ajustes. Eliminados «investigaciones», «la que prefiera» y «Sin conexión siguen funcionando las acciones locales».
  - Verificación: lint, check, test, build y playwright (360 passed, 4 skipped) correctos. Ningún test dependía de los textos cambiados. Afirmaciones no respaldadas por el README: ninguna.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `npm run lint` OK · `npm run check` 0 errores · `npm run test` 70/70 · `npm run build` OK · `npx playwright test --workers=2`: 360 pasan, 4 omitidas (WebKit), 0 fallos · `faq.ts` leído: sin «investigaciones» ni «prefiera»; 7 preguntas.
  Criterios: 3/3 cumplidos. Corrección trivial del orquestador: `prettier --write src/data/faq.ts`.
- **Intentos de revisión:** 1

### T-026 · Dominio definitivo jarvis.wilrd14.dev como URL por defecto
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-020
- **Prioridad:** Alta
- **Requisitos que cubre:** RF-13, RNF-07
- **Origen:** el usuario decidió el 2026-10-26 (Q-03) publicar en `https://jarvis.wilrd14.dev`.
- **Descripción:** Sustituir la URL provisional `https://jarvis-landing.example` por `https://jarvis.wilrd14.dev` como valor por defecto, de modo que canónica, `og:url`, `og:image`, sitemap y `robots.txt` salgan correctos aunque no se defina `PUBLIC_SITE_URL`. Archivos: `astro.config.mjs` (fallback de `site`; actualiza también el comentario), `src/data/site.ts` (`canonicalUrl`) y `README.md` (apartado de despliegue: la URL por defecto es la nueva y `PUBLIC_SITE_URL` solo sirve para sobreescribirla, p. ej. en previews). Ninguna ocurrencia de `jarvis-landing.example` debe quedar en `src/`, `public/`, `astro.config.mjs` ni `tests/`; si algún test asserta sobre el dominio, actualizar su literal. No toques `docs/`. No despliegues nada.
- **Zonas permitidas:** `astro.config.mjs`, `src/data/site.ts`, `README.md`, y literales del dominio en `tests/unit/` y `tests/e2e/`
- **Criterios de aceptación:**
  - [ ] Tras `npm run build` sin `PUBLIC_SITE_URL`, `dist/index.html`, `dist/sitemap-0.xml`, `dist/sitemap-index.xml` y `dist/robots.txt` usan `https://jarvis.wilrd14.dev` y ninguno contiene `jarvis-landing.example`
  - [ ] Con `PUBLIC_SITE_URL=https://ejemplo.test` el build sigue usando esa URL
  - [ ] Lint, check, tests unitarios y e2e completos sin fallos
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build` · `npx playwright test --workers=2`
- **Reporte del subagente:**
  - Cambios: `astro.config.mjs` (fallback `https://jarvis.wilrd14.dev` y comentario), `src/data/site.ts` (`canonicalUrl`), `README.md` (apartado de despliegue). Ningún test asertaba el dominio.
  - Verificación: lint OK; check 0 errores; test 70/70; build sin `PUBLIC_SITE_URL`: index.html, sitemap-0.xml, sitemap-index.xml y robots.txt usan el dominio nuevo y `grep jarvis-landing.example` en dist/src/public/tests/astro.config.mjs no da resultados; con `PUBLIC_SITE_URL=https://ejemplo.test` los mismos 3 archivos comprobados (index, sitemap-0, robots) usan esa URL; e2e `playwright test --workers=2`: 360 pasan, 4 omitidos, 0 fallos. Tras la prueba se reconstruyó dist con la URL por defecto.
  - Aviso: el comentario de `src/layouts/BaseLayout.astro` (línea 18) aún dice «valor provisional»; está fuera de mis zonas. Sin afirmaciones no respaldadas por el README.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: lint 0 errores · check 0 errores · test 70/70 · build sin `PUBLIC_SITE_URL`: `dist/index.html` (canónica y `og:image`) y `robots.txt` usan `https://jarvis.wilrd14.dev`; 0 ficheros con `jarvis-landing.example` en dist, src, public, tests y astro.config.mjs · e2e completo del subagente 360 pasan, 0 fallos.
  Criterios: 3/3 cumplidos. Corrección trivial del orquestador: comentario de `BaseLayout.astro:18` («valor por defecto» en vez de «provisional»).
- **Intentos de revisión:** 1

### T-027 · Instalación: aplicar los pasos y requisitos del README de Jarvis
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-014
- **Prioridad:** Media
- **Requisitos que cubre:** RF-10, RNF-10
- **Origen:** el usuario añadió el 2026-10-26 la instalación al README de Jarvis (commit `ec5f95f`), que cierra la duda del paso 1.
- **Descripción:** Actualizar la sección Instalación para que coincida con el apartado «Instalación en Windows» de `C:/Users/willi/Code/Jarvis/README.md` (solo lectura; léelo entero antes de escribir). Cambios: (1) Nuevo paso 1 «Clona el repositorio e instala las dependencias» con los comandos `git clone https://github.com/wilrd14/Jarvis.git`, `cd Jarvis` y `npm install` (sustituye al actual «Instala las dependencias»). (2) El paso «Compila y crea el acceso directo» (`npm run app:install`) añade que tarda unos minutos la primera vez y que al terminar aparece «Jarvis» en el Escritorio y en el menú Inicio. (3) Mantén el paso de pegar la API key y añade un paso final «Permite el micrófono cuando el navegador lo pida y empieza a hablar». (4) Añade una lista de requisitos antes de los pasos: Windows 10/11 con Microsoft Edge o Google Chrome (Edge viene con Windows); Node.js 20 o superior (LTS) y Git; una API key de OpenRouter con algo de saldo; un micrófono. Si hace falta un campo nuevo en `src/data/install.ts` (p. ej. `requirements`), tipado, y renderizarlo en `Install.astro` con los componentes existentes y solo tokens. Mantén la nota «Solo para Windows» y el arranque opcional con Windows. Comprueba que no haya scroll horizontal a 320 px (usa `wrap-anywhere` si hace falta) y que cada comando conserve su botón «Copiar» (si los tres comandos del paso 1 van en un solo bloque, que se copien juntos o uno por bloque, a tu criterio). Actualiza los literales y recuentos de pasos en `tests/unit/` y `tests/e2e/` que cambien. No toques `docs/`. No despliegues ni hagas commit.
- **Zonas permitidas:** `src/data/install.ts`, `src/sections/Install.astro`, y literales/recuentos en `tests/unit/` y `tests/e2e/`
- **Criterios de aceptación:**
  - [x] El paso 1 muestra `git clone https://github.com/wilrd14/Jarvis.git`, `cd Jarvis` y `npm install`, con botón «Copiar» funcional
  - [x] Los requisitos y los 4 pasos coinciden con el README de Jarvis, sin afirmaciones nuevas
  - [x] Sin scroll horizontal de 320 a 1440 px; foco y teclado intactos
  - [x] Sin «código abierto» ni precios; lint, check, tests unitarios y e2e completos sin fallos
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build` · `npx playwright test --workers=2`
- **Reporte del subagente:**
  - Archivos: `src/data/install.ts` (campo nuevo `requirements`, 4 pasos), `src/sections/Install.astro` (tarjeta de requisitos), `tests/unit/data/content.test.ts`, `tests/e2e/copy.spec.ts`, `tests/e2e/content.spec.ts`.
  - Paso 1: un solo bloque con los 3 comandos (git clone, cd Jarvis, npm install) que se copian juntos con un botón. Paso 2 con «unos minutos» y Escritorio/menú Inicio; paso 3 API key + Ajustes; paso 4 micrófono. Nota «Solo para Windows» y autoarranque intactos.
  - Verificación: lint 0 errores; check 0/0/0; test 70 pasan; build OK; playwright --workers=2: 360 pasan, 4 omitidos, 0 fallos (incluye scroll horizontal 320-1440 y a11y).
  - Afirmaciones no respaldadas por el README: ninguna (requisitos y pasos tomados del apartado «Instalación en Windows»). El README tiene un 5.º paso separado (abrir/Ajustes); lo fusioné con el de la API key para quedar en 4 pasos como pidió la tarea.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: lint 0 errores · check 0 errores · test 70/70 · build OK · `npx playwright test --workers=2` completo: 360 pasan, 4 omitidas (WebKit), 0 fallos (incluye scroll horizontal 320-1440 px, axe y copiado). `install.ts` leído y contrastado con «Instalación en Windows» del README de Jarvis (requisitos, `git clone`, `app:install`, API key, micrófono, autoarranque).
  Criterios: 4/4 cumplidos. Corrección trivial del orquestador: `prettier --write` en `install.ts`, `Install.astro` y `content.test.ts`.
  Hallazgos:
  1. El README de Jarvis tiene 5 pasos y la landing 4: «abrir Jarvis y entrar en Ajustes» se fusionó con el de la API key. Aceptado, el contenido es equivalente.
  2. Los tres comandos del paso 1 se copian juntos con un solo botón.
- **Intentos de revisión:** 1

### T-019 · Imagen social, iconos, robots, sitemap y datos estructurados
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-015
- **Prioridad:** Media
- **Requisitos que cubre:** RF-13
- **Descripción:** Completar los metadatos de RF-13: `public/og-image.png` (1200×630 según Brief §5.4; generarla desde SVG/HTML del proyecto con una herramienta ya presente o un script `scripts/` sin dependencias pesadas, justificando cualquier nueva), `favicon.ico`, `apple-touch-icon.png` (180×180), iconos copiados de `Jarvis/public/icon-*.png` si sirven, `public/robots.txt`, `@astrojs/sitemap` en `astro.config.mjs` y JSON-LD `SoftwareApplication` en `BaseLayout` (nombre, descripción, `operatingSystem: Windows`, autor, URL; sin `aggregateRating` ni precios inventados). Verificar que la URL canónica sale de `PUBLIC_SITE_URL`.
- **Zonas permitidas:** `public/`, `scripts/`, `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/data/site.ts`, `package.json` (dependencias justificadas)
- **Criterios de aceptación:**
  - [x] `dist/` contiene `sitemap-index.xml`, `robots.txt`, favicon, apple-touch-icon y `og-image.png` de 1200×630
  - [x] El HTML construido contiene `og:*`, `twitter:*`, canonical y el JSON-LD válido
  - [x] El JSON-LD no contiene datos que no estén respaldados por el README
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build`
- **Reporte del subagente:**
  - Archivos: `scripts/generate-assets.mjs` (nuevo; Chromium de Playwright + fuentes Fontsource en base64, importa `SITE`), `public/og-image.png` (1200x630, verificada visualmente), `public/apple-touch-icon.png` (180x180), `public/favicon.ico` (16/32/48, PNG embebido), `public/robots.txt`, `astro.config.mjs` (sitemap + mini integración que añade `Sitemap:` a `dist/robots.txt` con la URL de `PUBLIC_SITE_URL`), `BaseLayout.astro` (og:image/ancho/alto/alt, twitter:image, card `summary_large_image`, iconos, JSON-LD inline), `site.ts` (campos nuevos `ogImage`, `ogImageAlt`; ninguno eliminado), `package.json`.
  - Dependencia nueva: `@astrojs/sitemap` 3.7.4 exacta (sitemap oficial de Astro). `npm audit`: 0 vulnerabilidades. Para las imágenes no se añadió nada (Playwright ya era devDependency).
  - Verificación: `npm run check` 0 errores; `npm run build` OK; `dist/` contiene sitemap-index.xml, sitemap-0.xml, robots.txt (con línea Sitemap), favicon.ico/svg, apple-touch-icon.png, og-image.png; canonical, og:url, og:image y Sitemap cambian con `PUBLIC_SITE_URL` (probado con https://x.test). Prettier OK en mis archivos. `npm run lint` global falló solo por `tests/e2e/tmp-t022.spec.ts` (console, archivo de otra instancia); `eslint src scripts astro.config.mjs` limpio. Un `astro check` chocó (EPERM en node_modules/.astro) con un build paralelo y pasó al reintentar.
  - JSON-LD: SoftwareApplication con name, description (la de SITE, del README), operatingSystem Windows, inLanguage es, url, image, author Person (Williams Villavizar + wilrd14.dev). Sin rating ni precios. El JSON-LD escapa `<`. Scripts de cliente sin tocar.
  - Dudas/avisos: (1) No se copiaron `Jarvis/public/icon-*.png`: el favicon y el apple-touch se renderizan desde `favicon.svg` ya existente. (2) `robots.txt` necesita URL absoluta para Sitemap, por eso se completa en el build; en `dev` solo muestra Allow. (3) `canonicalUrl` sigue siendo provisional (Q-03). (4) `og:locale` es `es_ES` (ya estaba). (5) El texto alt de la imagen social es nuevo y describe solo logo, nombre y eslogan. Afirmaciones no respaldadas por el README: ninguna.
- **Revisión del orquestador:**
  Revisión · 2026-10-21 · Aprobada (intento 1)
  Verificado (global): `npm run lint` OK; `npm run check` 0 errores; `npm run test` 70/70; `npm run build` OK; `npm run test:e2e` 4/4; `prettier --check .` OK; sin cambios en CHANGELOG ni memory; sin archivos temporales en el árbol.
  `dist/` contiene `sitemap-index.xml`, `sitemap-0.xml`, `robots.txt` (con línea `Sitemap:`), `favicon.ico` (16/32/48), `favicon.svg`, `apple-touch-icon.png` (180×180) y `og-image.png` (1200×630, revisada a ojo: logo, nombre y eslogan). El HTML tiene todos los `og:*` (con ancho, alto y alt), `twitter:*` (`summary_large_image`), canonical y JSON-LD `SoftwareApplication` válido (se parseó con `JSON.parse`): nombre, descripción, `operatingSystem: Windows`, idioma, url, imagen y autor; sin `aggregateRating`, `offers` ni precios (0 coincidencias). Con `PUBLIC_SITE_URL=https://x.test` cambian canonical, `og:url`, `og:image`, la línea `Sitemap:` y el sitemap. Dependencia nueva: `@astrojs/sitemap` 3.7.4 exacta (la prevista en Arquitectura §3). Corrección trivial hecha por el orquestador: en `BaseLayout.astro` el `replaceAll` del JSON-LD era un no-op; ahora escapa `<` como `<` (el JSON sigue siendo válido). Criterios: 3/3. Hallazgos: sin bloqueantes. (1) `scripts/generate-assets.mjs` regenera los PNG/ICO con el Chromium de Playwright; no está enlazado a un script de npm (se ejecuta con `node scripts/generate-assets.mjs`). (2) No se copiaron `Jarvis/public/icon-*.png`: el favicon y el apple-touch se renderizan desde `favicon.svg`. (3) Hay 3 scripts ejecutables inline (nav, hologram, copy) además del JSON-LD: T-020 los cubre con hashes en la CSP. (4) `canonicalUrl` sigue siendo provisional (Q-03).
- **Intentos de revisión:** 1

### T-020 · Cabeceras de seguridad y configuración de despliegue
- **Estado:** Aprobada
- **Agente:** frontend-dev
- **Depende de:** T-019
- **Prioridad:** Alta
- **Requisitos que cubre:** RNF-07
- **Descripción:** Con el hosting ya decidido por el usuario (PRD Q-06), añadir la configuración de cabeceras (`vercel.json` o `public/_headers`): CSP según Arquitectura §10, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`, y caché larga para activos con hash. Verificar con la build real y `npm run preview` que la CSP no bloquea scripts ni estilos (si Astro inyecta scripts inline, usar hashes). Documentar en el reporte cómo conectar el repositorio/carpeta al hosting. **No desplegar ni publicar.**
- **Zonas permitidas:** `vercel.json` o `public/_headers`, `astro.config.mjs`, `README.md` del proyecto (nuevo, con instrucciones de desarrollo y despliegue)
- **Criterios de aceptación:**
  - [ ] Las cabeceras listadas están definidas en el archivo del hosting elegido
  - [ ] Con la CSP aplicada (probada en local con un servidor que añada las cabeceras o con `<meta>` equivalente), la consola del navegador no muestra violaciones y el holograma, el menú y el copiado funcionan
  - [ ] `README.md` explica instalación, scripts y despliegue
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run build` · `npm run test:e2e`
- **Reporte del subagente:**
  - Archivos: `public/_headers` (nuevo), `astro.config.mjs` (integración `csp-hashes`), `README.md` (nuevo). Sin dependencias nuevas.
  - `_headers` (Cloudflare Pages): CSP (`default-src 'self'; script-src 'self' <hashes>; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri/form-action 'self'; frame-ancestors 'none'`), nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy con APIs en `()`, X-Frame-Options DENY y `Cache-Control: public, max-age=31536000, immutable` en `/_astro/*`.
  - Los 3 scripts inline de Astro cambian con cada build: la integración calcula sus SHA-256 y sustituye el marcador `{{SCRIPT_HASHES}}` en `dist/_headers` (verificado: sin marcador, 3 hashes). El JSON-LD no se ejecuta, no necesita hash.
  - Desviaciones del texto de Arquitectura §10, necesarias: `font-src 'self' data:` (Vite incrusta fuentes pequeñas como data URI; sin ello hay violación) y `style-src-attr 'unsafe-inline'` (el atributo `style="height: 30%"` de las barras de la maquetas de voz). `<style>` inline sigue bloqueado. Añadí además `X-Frame-Options` (refuerzo) y `object-src 'none'`.
  - Verificación de CSP: servidor Node temporal que servía `dist/` con la CSP real de `dist/_headers`; prueba Playwright temporal (ya borrada) en Chromium, Firefox y WebKit: 0 eventos `securitypolicyviolation`, 0 errores/avisos de consola, holograma (canvas visible), menú móvil (`aria-expanded`) y copiado («Copiado») funcionan. 6/6 pasaron. Antes de añadir `data:` a `font-src` falló con «font-src data», confirmando que la prueba detecta violaciones.
  - Comandos: `npm run lint` 0 errores; `npm run check` 0 errores/avisos/hints; `npm run build` sin errores; `npm run test:e2e` 360 pasadas, 4 omitidas (las omitidas ya existían). Prettier aplicado a README.md y astro.config.mjs (no tiene parser para `_headers`).
  - Cómo conectar a Cloudflare Pages (en README): conectar repositorio o subir `dist/`; build `npm run build`, salida `dist`, `NODE_VERSION=22`, `PUBLIC_SITE_URL` con la URL final. No se desplegó nada.
  - Notas: `npm run dev` y `preview` no aplican `_headers` (solo el hosting); la CSP se probó con el servidor temporal. Si cambia el hosting o se añaden scripts inline/terceros, hay que revisar la CSP. Afirmaciones de contenido: el README del proyecto solo describe a Jarvis como «asistente de voz para Windows», respaldado por el README de Jarvis.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: `npm run build` OK; `dist/_headers` sale sin marcador y con 3 hashes · lint 0 errores · check 0 errores · prueba propia temporal (spec borrado): `dist/` servido con la CSP real de `dist/_headers`, 0 violaciones ni avisos de consola y canvas del holograma visible en Chromium y Firefox · e2e completo 360 pasan, 0 fallos (ejecutado por el subagente; yo repetí solo lo anterior). No se desplegó nada.
  Criterios: 3/3 cumplidos.
  Hallazgos:
  1. `font-src data:` y `style-src-attr 'unsafe-inline'` se apartan del texto literal de Arquitectura §10; justificado y documentado en §10 por el orquestador. Se añadieron además `X-Frame-Options` y `object-src 'none'` (refuerzo aceptado).
  2. `PUBLIC_SITE_URL` debe definirse en Cloudflare Pages; si no, canónica, sitemap y `robots.txt` usan `https://jarvis-landing.example` (comprobar en T-021).
- **Intentos de revisión:** 1

### T-021 · Verificación final de calidad (puerta de release)
- **Estado:** Aprobada
- **Agente:** qa-tester
- **Depende de:** T-017, T-018, T-019, T-020
- **Prioridad:** Alta
- **Requisitos que cubre:** OBJ-01 a OBJ-04, RNF-01 a RNF-10
- **Descripción:** Ejecutar la batería completa sobre el build final (`npm run lint`, `npm run check`, `npm run test`, `npm run build`, `npm run test:e2e`, presupuesto de JS y Lighthouse) y producir una tabla RNF → resultado con evidencia. Revisar la veracidad del contenido (RNF-10) comparando cada sección con el README de Jarvis y listar cualquier discrepancia. No corregir código de producción.
- **Zonas permitidas:** `tests/` (solo lectura salvo ajustes de pruebas propias)
- **Criterios de aceptación:**
  - [ ] Todos los comandos terminan sin errores, o los fallos están documentados con severidad
  - [ ] Tabla RNF-01…RNF-10 con resultado y evidencia real
  - [ ] Lista de discrepancias de contenido frente al README (o «ninguna»)
  - [ ] Veredicto explícito: listo / no listo para publicar
- **Verificación (comandos):** `npm run lint` · `npm run check` · `npm run test` · `npm run build && npm run test:e2e` · `node tests/perf/budget.mjs`
- **Reporte del subagente:**
  Ejecutado 2026-10-26, sin tocar código de producción. lint 0 errores · check 0/0/0 · vitest 70/70 · build OK · e2e `--workers=2`: 360 pasan, 4 omitidos (skips deliberados de WebKit en a11y.spec.ts), 0 fallos · budget JS 2,79 KB gz (límite 60). Lighthouse móvil x3 (Rend/Acc/BP/SEO): 99/100/100/100 · 96/100/100/100 · 99/100/100/100; LCP 1,67-1,75 s, CLS 0,001, TBT 0/199/0 ms (la ejecución 2 roza el límite de 200 ms). `PUBLIC_SITE_URL` provisional (`https://jarvis-landing.example`) en canónica, og:url, og:image, sitemap y robots.txt: pendiente de configurar en Cloudflare Pages (no es defecto). Veredicto y discrepancias de contenido: ver informe final al orquestador.
- **Revisión del orquestador:**
  Revisión · 2026-10-26 · Aprobada (intento 1)
  Verificado: reporte del subagente contrastado con la ejecución previa de la suite (lint, check, 70 tests, build, e2e 360/0 fallos con `--workers=2`, presupuesto JS 2,79 KB, Lighthouse x3 ≥ 96 en las 4 categorías). Tabla RNF-01…RNF-10 presente; RNF-10 «Parcial».
  Criterios: 4/4 cumplidos (veredicto explícito del subagente: NO LISTO por pendientes de configuración y contenido, no por defectos de código).
  Hallazgos (pendientes del usuario antes de publicar):
  1. `PUBLIC_SITE_URL` sin definir en Cloudflare Pages (Q-03, dominio).
  2. Repo `wilrd14/Jarvis` debe ser público o los CTA dan 404 (Q-01).
  3. FAQ: «puede hacer investigaciones», «OpenRouter es una API key» y «la que prefiera» están confirmados por el usuario pero no figuran en el README de Jarvis (RNF-10). Decisión del usuario: añadirlos al README de Jarvis o suavizar el texto.
  4. Fuentes variables en un Safari/iPhone real: sin verificar.
  5. TBT de Lighthouse en la ejecución 2 = 199 ms (límite 200): margen justo, probable ruido de la máquina.
- **Intentos de revisión:** 1

---

## Trazabilidad de requisitos
| Requisito | Tareas |
|---|---|
| RF-01 | T-009, T-016 |
| RF-02, RF-03 | T-010, T-016 |
| RF-04, RF-05 | T-011, T-016 |
| RF-06, RF-07 | T-012, T-016 |
| RF-08, RF-09 | T-013, T-016 |
| RF-10 | T-005, T-014, T-016 |
| RF-11 | T-006, T-015, T-016 |
| RF-12 | T-006, T-007, T-016 |
| RF-13 | T-003, T-019, T-016 |
| RF-14 | T-014, T-016 |
| RF-15 | T-008, T-017 |
| RF-16 | T-015, T-016 |
| RNF-01, RNF-02 | T-001, T-008, T-018, T-021 |
| RNF-03, RNF-04 | T-002, T-017, T-021 |
| RNF-05, RNF-08 | T-002, T-016 |
| RNF-06 | T-003, T-018 |
| RNF-07 | T-020 |
| RNF-09 | T-001, T-003, T-004 |
| RNF-10 | T-010 a T-014, T-021 |

---

## Plantilla de reporte del subagente
```
**Resumen:** qué se hizo en 2-4 líneas.
**Archivos creados/modificados:** lista con una línea de propósito cada uno.
**Decisiones tomadas:** y por qué (solo las no triviales).
**Verificación ejecutada:** comando → resultado real (pegar salida relevante).
**Criterios de aceptación:** [x] cumplido / [ ] no cumplido, uno por uno.
**Dependencias añadidas:** nombre, versión, motivo (o "ninguna").
**Dudas, bloqueos o pendientes:** lo que el orquestador debe saber.
```
