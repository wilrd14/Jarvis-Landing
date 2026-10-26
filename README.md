# Jarvis Landing

Landing page estática en español de [Jarvis](https://github.com/wilrd14/Jarvis), un asistente de
voz para Windows. Presenta qué hace Jarvis (conversación por voz, órdenes instantáneas, acciones
sobre el PC, documentos, skills y memoria, uso desde el celular), cómo cuida la seguridad y los
costes, cómo se instala y quién lo hizo.

Está construida con Astro, TypeScript (`strict`) y Tailwind CSS 4. No usa analítica, cookies ni
recursos de terceros: las fuentes están autoalojadas y todas las peticiones van al mismo origen.

> El contenido sale del README de Jarvis. La landing no afirma nada que no esté ahí.

## Requisitos

Node.js 22.23.4 o superior.

## Primeros pasos

```bash
git clone https://github.com/wilrd14/Jarvis-Landing.git
cd Jarvis-Landing
npm install
npm run dev
```

El servidor de desarrollo queda en http://localhost:4321.

## Scripts

| Comando            | Qué hace                                                         |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo en http://localhost:4321                  |
| `npm run build`    | Genera el sitio estático en `dist/`                              |
| `npm run preview`  | Sirve `dist/` en local                                           |
| `npm run lint`     | ESLint                                                           |
| `npm run check`    | Comprobación de tipos con `astro check`                          |
| `npm run format`   | Prettier                                                         |
| `npm run test`     | Pruebas unitarias (Vitest)                                       |
| `npm run test:e2e` | Pruebas end-to-end (Playwright); requiere `npm run build` previo |
| `npm run perf`     | Presupuesto de JS y Lighthouse                                   |

## Estructura

```text
src/
  components/   Piezas de interfaz reutilizables (Button, Card, CodeBlock, HologramCore…)
  sections/     Una sección de la página por archivo (Hero, Voice, Install, Faq…)
  data/         Todo el contenido tipado, con la sección del README de Jarvis que lo respalda
  layouts/      BaseLayout: metadatos SEO, cabecera y pie
  lib/          Lógica pura con pruebas unitarias
  pages/        index.astro compone las secciones
  scripts/      Scripts de cliente (navegación, holograma)
  styles/       Tokens de diseño y estilos globales
tests/
  unit/         Vitest
  e2e/          Playwright: contenido, navegación, copiado, responsive, accesibilidad y privacidad
  perf/         Presupuesto de JS y Lighthouse
public/         Imágenes sociales, iconos, robots.txt y _headers
docs/           PRD, brief UX/UI, arquitectura, reglas de desarrollo, tareas y changelog
```

Los textos viven en `src/data/` y no en los componentes, así que cambiar el copy no exige tocar
el marcado.

## Pruebas y calidad

- **Unitarias:** `npm run test` (Vitest), incluido el contenido de `src/data/`.
- **End-to-end:** `npm run build && npx playwright test --workers=2` en Chromium, Firefox, WebKit
  y un perfil móvil. Cubre contenido, navegación, copiado, ausencia de scroll horizontal de 320 a
  1440 px, accesibilidad con axe, `prefers-reduced-motion` y privacidad.
- **Rendimiento:** `npm run perf` comprueba que el JS no pase de 60 KB gzip (hoy ≈ 2,8 KB) y
  ejecuta Lighthouse móvil. En las mediciones de release salieron 96-99 de rendimiento y 100 en
  accesibilidad, buenas prácticas y SEO.

> Con más de 2 workers, Firefox puede dar timeouts de carga en equipos modestos.

## Despliegue (Cloudflare Pages)

El hosting elegido es Cloudflare Pages. Esta guía no despliega nada por sí sola.

1. En Cloudflare: Workers & Pages > Create > Pages > conectar el repositorio (o subida directa
   de la carpeta `dist/` tras `npm run build`).
2. Configuración de build: comando `npm run build`, directorio de salida `dist`, variable
   `NODE_VERSION` = `22`.
3. Define `PUBLIC_SITE_URL` con la URL final (por ejemplo `https://tu-dominio`). Fija la URL
   canónica, el sitemap, `robots.txt` y las metaetiquetas sociales. Si no se define se usa una
   URL provisional (`https://jarvis-landing.example`).

### Cabeceras de seguridad

`public/_headers` define la CSP, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options` y la caché larga (`immutable`) de `/_astro/*`. Astro
inyecta scripts inline cuyo contenido cambia en cada build, así que la integración `csp-hashes`
de `astro.config.mjs` calcula sus hashes SHA-256 y los escribe en `dist/_headers` al terminar el
build. No edites `dist/_headers` a mano y no añadas scripts inline sin pasar por el build.

`font-src` admite `data:` porque Vite incrusta las fuentes más pequeñas como data URI, y
`style-src-attr 'unsafe-inline'` permite los atributos `style` de las maquetas ilustrativas
(no permite `<style>` inline ni hojas externas). Estas cabeceras solo las aplica el hosting:
`npm run dev` y `npm run preview` no las usan.

## Autor

Williams Villavizar · [wilrd14.dev](https://wilrd14.dev)

## Licencia

GNU GPL v3.0 (ver [LICENSE](LICENSE)). Esta licencia es la de la landing; no dice nada sobre la de Jarvis.
