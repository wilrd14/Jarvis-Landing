# Memoria del proyecto — Jarvis Landing

Memoria viva mantenida por el orquestador. Debe seguir siendo corta (menos de ~120 líneas): al crecer, condensa lo antiguo en lugar de acumular. No guardes aquí secretos ni credenciales.

## Identidad
- **Proyecto:** Jarvis Landing (web frontend, landing page estática)
- **Carpeta:** C:/Users/willi/Code/Jarvis-Landing
- **Arquitectura:** sitio estático con Astro, organizado por secciones y con contenido tipado separado
- **Stack:** Astro + TypeScript (strict) + Tailwind CSS 4, Vitest, Playwright + axe; despliegue estático (Vercel o Cloudflare Pages, por decidir)
- **GitHub:** no (por ahora)
- **Creado:** 2026-10-21

## Estado actual
- **Fase:** 2 — MVP (contenido de secciones)
- **Última tarea aprobada:** T-021 (2026-10-26). Todas las tareas T-001 a T-024 aprobadas; código listo, publicación pendiente del usuario.
- **En curso:** ninguna
- **Antes de publicar (veredicto T-021 «no listo»):** definir `PUBLIC_SITE_URL` en Cloudflare Pages (Q-03); repo de Jarvis público (Q-01); decidir si «investigaciones», «OpenRouter = API key» y «la que prefiera» (FAQ) se añaden al README de Jarvis o se suavizan (RNF-10); verificar fuentes en Safari/iPhone real; paso 1 de instalación cuando esté en el README. Lighthouse móvil: 96-99 rend., 100 resto, TBT máx. 199 ms. Cabeceras en `public/_headers` (Cloudflare Pages); los hashes de la CSP se generan en cada `npm run build`: si se añaden scripts inline o recursos externos, revisar la CSP.
- **Decisión pendiente (baja):** RF-11 del PRD dice «misma pestaña» en los enlaces del pie, pero el código usa `target="_blank"`. Decidir si se ajusta el PRD o el código.

## Comandos del proyecto
Aún no existen (los crea T-001). Previstos:

| Acción | Comando |
|---|---|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` (http://localhost:4321) |
| Tests | `npm run test` (unitarias) · `npm run test:e2e` (tras `npm run build`) |
| Lint | `npm run lint` · `npm run check` |
| Build | `npm run build` |

## Decisiones tomadas
- 2026-10-21 · Arquitectura de sitio estático con Astro + Tailwind confirmada por el usuario (alternativa descartada: React + Vite).
- 2026-10-21 · Contenido en español; fuente de verdad: `C:/Users/willi/Code/Jarvis/README.md` (solo lectura).
- 2026-10-21 · Sin analítica ni librerías de animación/iconos en el MVP; fuentes autoalojadas.
- 2026-10-21 · Identidad visual tomada de Jarvis (fondo `#030504`, esmeralda `#1fe0a0`, turquesa `#14c4c4`; fuentes Space Grotesk, Geist y JetBrains Mono).
- 2026-10-21 · Versiones de referencia verificadas con `npm view`: Astro 7.4.2, Tailwind 4.3.3, TypeScript 7.0.2, Vitest 5.0.5, Playwright 1.64.1, ESLint 10.13.0. T-001 debe confirmar compatibilidad entre ellas.

- 2026-10-21 · ADR-006: TypeScript 6.0.3 en lugar de 7.0.2 (incompatible con `@astrojs/check` y `typescript-eslint`). Versiones instaladas fijadas exactas. Node ≥ 22.23.4.

## Convenciones aprendidas
- Comandos disponibles: `npm run dev|build|preview|lint|check|format|test|test:e2e` (e2e exige `npm run build` previo; preview en el puerto 4322). Helper `trackRequests` en `tests/e2e/helpers/same-origin.ts`. Firefox/WebKit de Playwright funcionan en este equipo.
- `index.astro` ya usa `BaseLayout`. Paleta de Tailwind vaciada: solo existen los 12 tokens del Brief (`bg-panel`, `text-emerald`, `font-display`, `text-title-1`, `rounded-card`…); nada de `text-emerald-500`.
- Iconos: la geometría está en `src/components/icons.ts` (mapa `ICONS`, tipo `IconName`) e `Icon.astro` solo dibuja; ambos archivos son compartidos y solo se editan en tareas que los listan. `_ui.astro` no se enruta (prefijo `_`).
- Componentes: `Button` (`href` → `<a>`, `external` → rel/target), `Card` (`variant`, `as`), `Container`, `SectionHeading` (`id` obligatorio), `Steps` (`items`), `Badge` (`tone`, `icon`).
- Header/Footer reciben todo por props desde `BaseLayout` (textos en `src/data/nav.ts`; `site.ts` tiene `author`). Atributos `data-*` añadidos al contrato: `data-label-open`/`data-label-close` (botón de menú), `data-nav-sections` (enlace → ids que lo activan), `data-hologram-fallback`. La cabecera es `fixed`: el Hero necesita padding superior. «Capacidades» (`#voz`) se resalta en `#voz #instantaneas #acciones #documentos #skills #movil`.
- `CodeBlock` recibe por props `lines`, `copyLabel`, `copiedLabel`, `errorLabel`, `buttonAriaLabel?` (los textos vienen de `src/data/`). Lógica en `src/lib/copy-state.ts`. Copiado verificado en navegador (permiso, denegado, sin API, sin JS).
- Contenido real en `src/data/*.ts` (hero, voice, instant, actions, documents, skills, mobile, security, costs, install, faq, author) con cabecera que cita la sección del README. Maquetas (voz, confirmación, coste) rotuladas «ilustrativa» y con `aria-hidden`. Sin precios ni «Código abierto» (Q-01 abierta).
- Texto sin espacios (rutas, URLs) en párrafos: usar `wrap-anywhere` para no provocar scroll horizontal a 320 px.
- Capturas: las tomadas antes de cargar la fuente muestran el título en peso fino (FOUT, `font-display: swap`); esperar a `document.fonts.ready`. WebKit con DPR 2 no admite capturas de página completa > 32767 px.
- Los scripts de cliente salen inline en el HTML (nav ≈ 0,8 KB gz, hologram ≈ 1,5 KB gz): T-020 debe poner hashes en la CSP (`script-src`) o forzar scripts externos.
- Verificación en navegador: sin páginas reales, usar una página temporal (`src/pages/tmp-*.astro`) y un spec temporal (`tests/e2e/_tmp-*.spec.ts`), y borrarlos tras la prueba.
- Fuentes Fontsource importadas en `global.css`; `site.ts` exporta `SITE`. Precarga de fuentes del hero, `og:image` y JSON-LD quedan pendientes (T-019).
- Pruebas: la suite e2e completa se ejecuta con `npx playwright test --workers=2` (con más workers Firefox da timeouts de carga). Un `astro preview` huérfano bloquea el arranque: `npx astro preview stop`. WebKit no incluye enlaces en Tab (esas pruebas se omiten). `npm run perf` = presupuesto JS + Lighthouse (npx, usar 127.0.0.1).
- Quirk del shell: el guardia del PowerShell bloquea comandos con regex que parecen rutas (`/^\/`, `revisión:\*\*`); para ediciones usar Edit y para temporales Bash.
- Jarvis es un asistente de voz en español para Windows (Next.js 16, Electron, OpenRouter). El autor es Williams Villavizar (`https://wilrd14.dev`); repositorio: `https://github.com/wilrd14/Jarvis`.

## Problemas conocidos
- Riesgo sin confirmar: en el WebKit de Playwright (Windows) las tres fuentes variables se dibujan en peso 300 (ignoran el eje `wght`, también con `font-variation-settings`); en Chromium y Firefox salen bien. Probablemente sea una limitación de esa compilación y no de Safari, pero no está verificado en un Safari/iPhone real: comprobarlo antes de publicar. Plan B: fuentes estáticas de Fontsource (más KB).
- Al editar `docs/PROJECT-TASKS.md` con scripts, acotar cada bloque por su cabecera `### T-0XX` y comprobar después el estado de TODOS los bloques (un script marcó por error T-016 a T-018 como aprobadas y hubo que revertirlo).
- Sin capturas ni vídeo de Jarvis: se usan maquetas HTML/CSS (PRD Q-02).

## Preguntas pendientes para el usuario
- FAQ (T-014), respuestas del usuario del 2026-10-26: sin internet funcionan solo las acciones locales (abrir apps, etc.); con internet hace investigaciones; cada persona usa su propia API key de OpenRouter (o la que quiera); OpenRouter = una API key que da acceso a múltiples modelos de IA; por ahora solo Windows; la instalación la añadirá él más tarde al README de Jarvis (hasta entonces el paso 1 no se puede afirmar). Datos a OpenRouter: el usuario confirmó (2026-10-26) usar solo lo que dice el README («Todo pasa por OpenRouter y se paga por uso. Las órdenes locales no cuestan nada»); no afirmar qué datos concretos viajan ni que algo se procese en local salvo las órdenes instantáneas.
- (Resuelta 2026-10-26) Q-01: el repo de Jarvis es público. Eso no implica licencia: no escribir «código abierto»/«open source» salvo que haya LICENSE en el repo de Jarvis.
- Q-02 ¿Hay capturas o vídeo de Jarvis?
- Q-03 ¿Dominio previsto para la landing?
- Q-04 ¿Analítica respetuosa con la privacidad?
- Q-05 ¿Versión en inglés más adelante?
- (Resuelta 2026-10-26) Q-06: hosting = Cloudflare Pages. T-020 desbloqueada (cabeceras en `_headers`, CSP con hashes de scripts inline).
