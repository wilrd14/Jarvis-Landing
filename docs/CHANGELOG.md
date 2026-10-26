# Changelog — Jarvis Landing

Registro **únicamente de cambios de desarrollo**: funcionalidades, correcciones, refactors, cambios de dependencias y de configuración de build/entorno que ya fueron revisados y aprobados.

**No se registra aquí:** ediciones de documentación, planificación, cambios en `PROJECT-TASKS.md`, actualizaciones de `memory.md` ni trabajo sin aprobar.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Cada entrada lleva el ID de la tarea. Solo el orquestador edita este archivo.

## [Sin publicar]

### Añadido
- Proyecto base Astro 7.4.2 estático con TypeScript estricto, Tailwind 4, ESLint, Prettier, alias `@/`, estructura de carpetas por secciones y página mínima con `h1` «Jarvis»; scripts `dev`, `build`, `preview`, `lint`, `check` y `format` (T-001, frontend-dev, 2026-10-21)
- Sistema visual base: tokens de color, tipografía, radios y espaciado en Tailwind (paleta por defecto eliminada), estilos globales con foco visible y respeto a `prefers-reduced-motion`, y fuentes Space Grotesk, Geist y JetBrains Mono autoalojadas (T-003, frontend-dev, 2026-10-21)
- `BaseLayout` con `lang="es"`, metadatos SEO (title, description, canonical, Open Graph, Twitter Card), enlace «Saltar al contenido» y `<main id="contenido">`; configuración del sitio en `src/data/site.ts`; `logo.svg` y `favicon.svg` (T-003, frontend-dev, 2026-10-21)
- Utilidad de ratio de contraste WCAG con 16 pruebas unitarias sobre los pares de color de texto (T-003, frontend-dev, 2026-10-21)
- Dependencias: `@fontsource-variable/space-grotesk`, `geist` y `jetbrains-mono` 5.3.0 (T-003, frontend-dev, 2026-10-21)
- Infraestructura de pruebas: Vitest (`npm run test`) y Playwright con proyectos Chromium, Firefox, WebKit y móvil 375×667 (`npm run test:e2e` sobre `npm run preview`), prueba de humo de la portada y helper que falla ante peticiones fuera del mismo origen (T-002, qa-tester, 2026-10-21)
- Dependencias de pruebas: vitest 5.0.5, @playwright/test 1.64.1, @axe-core/playwright 4.14.0 (T-002, qa-tester, 2026-10-21)
- Componentes UI base tipados y accesibles: `Container`, `Button` (primario, secundario y enlace; `<a>` o `<button>`; enlaces externos con `rel="noopener noreferrer"`; área táctil de 44 px), `SectionHeading`, `Card` (normal y destacada, esquinas HUD), `Badge` y `Steps` (T-004, frontend-dev, 2026-10-21)
- `Icon` con 41 iconos de trazo fino en SVG en línea (geometría en `src/components/icons.ts`) y página de muestra `_ui.astro` (T-004, frontend-dev, 2026-10-21)
- Cabecera fija con logo, enlaces ancla, botón «Ver en GitHub» y menú móvil accesible (clic, Enter, Espacio y Esc con retorno de foco), fondo translúcido al hacer scroll y resaltado de la sección visible; pie con enlaces a GitHub y portafolio; ambos integrados en `BaseLayout` y funcionales sin JavaScript (T-006, frontend-dev, 2026-10-21)
- Componente `HologramCore`: holograma en canvas (anillos segmentados, marcas HUD y partículas orbitales) que se pausa fuera de pantalla y con la pestaña oculta, dibuja un solo fotograma con `prefers-reduced-motion` y muestra el logo estático sin JavaScript; lógica de partículas pura con 11 pruebas unitarias (T-008, frontend-dev, 2026-10-21)
- Componente `CodeBlock` con botón «Copiar»: usa el portapapeles, cambia a «Copiado» 2 s con anuncio `aria-live`, y si falla muestra un mensaje de error y deja el texto seleccionado; sin JavaScript el comando sigue visible y seleccionable; lógica de estado en `src/lib/copy-state.ts` con pruebas unitarias (T-005, frontend-dev, 2026-10-21)
- Esqueleto de la página: 13 secciones (`Hero`, `Voice`, `Instant`, `Actions`, `Documents`, `SkillsMemory`, `Mobile`, `Security`, `Costs`, `Install`, `Faq`, `Author`, `FinalCta`) con sus anclas, un único `h1` y títulos `h2` provisionales, compuestas en `index.astro` en el orden del Brief (T-007, frontend-dev, 2026-10-21)
- Sección Hero: título «Jarvis», eslogan, CTAs «Ver en GitHub» y «Cómo se instala», etiquetas Next.js 16, OpenRouter y Windows, y holograma integrado, todo visible sin scroll en 375×667 y 1440×900 (T-009, frontend-dev, 2026-10-21)
- Secciones Conversación por voz (4 puntos y maqueta de burbujas) y Órdenes instantáneas (8 órdenes, «Sin IA · sin coste») con contenido en `src/data/` (T-010, frontend-dev, 2026-10-21)
- Secciones Acciones sobre tu PC (capacidades por grupo, «¿Qué estoy viendo?» y maqueta de confirmación) y Documentos (8 formatos, carpeta sin sobrescribir y coste estimado) (T-011, frontend-dev, 2026-10-21)
- Secciones Skills y memoria (7 skills, memoria desactivable y borrable) y Uso desde el celular (3 pasos con Tailscale, aviso de PC encendido y sin exposición a internet) (T-012, frontend-dev, 2026-10-21)
- Secciones Seguridad (6 garantías con frase técnica) y Costes (3 bloques, sin precios) (T-013, frontend-dev, 2026-10-21)
- Secciones Instalación (pasos con botón «Copiar», nota de Windows y autoarranque) y FAQ (7 preguntas con `<details>` operables con teclado) (T-014, frontend-dev, 2026-10-21)
- Secciones Autor (enlace al portafolio) y CTA final (GitHub e instalación) (T-015, frontend-dev, 2026-10-21)
- Metadatos completos: imagen social `og-image.png` (1200×630), `apple-touch-icon.png`, `favicon.ico`, `robots.txt`, sitemap (`@astrojs/sitemap` 3.7.4) y datos estructurados JSON-LD `SoftwareApplication`; canonical, `og:*` y sitemap derivados de `PUBLIC_SITE_URL`; script `scripts/generate-assets.mjs` para regenerar las imágenes (T-019, frontend-dev, 2026-10-21)
- 41 pruebas unitarias del contenido de `src/data`: recuentos de los requisitos, anclas reales, URLs, iconos y ausencia de importes y de «código abierto» (T-023, qa-tester, 2026-10-21)
- Pruebas e2e de Playwright (65 por navegador, 260 ejecuciones en Chromium, Firefox, WebKit y móvil): anclas y contenido de las 13 secciones, CTAs a GitHub, FAQ, menú móvil por teclado, resaltado de navegación al hacer scroll, copiado (éxito, permiso denegado, sin API, sin JS) y ausencia de scroll horizontal en 320, 375, 768, 1024 y 1440 px (T-016, qa-tester, 2026-10-26)

- Pruebas de accesibilidad y movimiento reducido (`a11y.spec.ts`): axe WCAG 2.0/2.1 A y AA sin violaciones en escritorio, móvil, menú abierto, FAQ desplegado y `prefers-reduced-motion`; estructura de encabezados y landmarks, navegación por teclado con foco visible, y holograma sin animación bajo movimiento reducido (T-017, qa-tester, 2026-10-26)
- Pruebas de privacidad (`privacy.spec.ts`: solo mismo origen, sin cookies ni almacenamiento) y de rendimiento: presupuesto de JS ≤ 60 KB gzip (`tests/perf/budget.mjs`, hoy 2,79 KB) y Lighthouse móvil; nuevo script `npm run perf` (T-018, qa-tester, 2026-10-26)

- Configuración de despliegue para Cloudflare Pages: `public/_headers` con CSP (los hashes SHA-256 de los 3 scripts inline se calculan en cada build mediante la integración `csp-hashes` de `astro.config.mjs`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`, `X-Frame-Options` y caché inmutable para `/_astro/*`; `README.md` del proyecto con instalación, scripts y despliegue (T-020, frontend-dev, 2026-10-26)

### Cambiado
- Sección Instalación alineada con el README de Jarvis: lista de requisitos (Windows 10/11 con Edge o Chrome, Node.js 20+ y Git, API key de OpenRouter con saldo, micrófono), paso 1 con `git clone`, `cd Jarvis` y `npm install` (se copian juntos), aviso de que la primera compilación tarda unos minutos y paso final para permitir el micrófono (T-027, frontend-dev, 2026-10-26)
- La URL por defecto del sitio pasa a `https://jarvis.wilrd14.dev`: canónica, `og:url`, `og:image`, sitemap y `robots.txt` salen con el dominio definitivo sin definir `PUBLIC_SITE_URL` (T-026, frontend-dev, 2026-10-26)
- FAQ: las respuestas sobre internet (las respuestas y la voz requieren conexión; las órdenes instantáneas se resuelven en el PC sin IA), Mac/Linux (por ahora solo Windows) y OpenRouter (servicio de pago por uso que exige tu propia API key) se ajustan a lo que respalda el README de Jarvis (T-024 y T-025, frontend-dev, 2026-10-26)
- `CodeBlock`: por debajo de 640 px el botón «Copiar» pasa bajo el comando a ancho completo; el número de los pasos es más compacto en móvil (`Steps` e Instalación) (T-022, frontend-dev, 2026-10-21)
### Corregido
### Eliminado
- Página temporal de componentes `_ui.astro` (T-007, frontend-dev, 2026-10-21)

### Seguridad
