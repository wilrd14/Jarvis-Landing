# Developer Rules — Jarvis Landing

Reglas obligatorias para todo el código del proyecto. Las siguen los subagentes al implementar y el orquestador al revisar. Una regla que no se pueda verificar no sirve: están escritas de forma comprobable.

## 1. Principios
1. Cumple la tarea asignada y nada más: sin funcionalidades extra ni refactors no pedidos.
2. Si algo no está definido en `docs/`, no lo inventes: repórtalo como duda.
3. Prefiere código simple y legible sobre código ingenioso.
4. Todo cambio funcional lleva su prueba.
5. **Veracidad del contenido:** ningún texto sobre Jarvis puede afirmar algo que no esté en `C:/Users/willi/Code/Jarvis/README.md` o en su código. Sin cifras, precios, métricas ni testimonios inventados. Ante la duda, repórtala.

## 2. Estructura y nombres
- Estructura de carpetas: la definida en `SYSTEM-ARCHITECTURE.md` §5. No crees carpetas de primer nivel nuevas sin aprobación.
- Archivos de componentes y secciones `.astro`: `PascalCase` (`CodeBlock.astro`). Resto de archivos (`.ts`, `.css`, imágenes): `kebab-case` (`hologram.ts`, `og-image.png`).
- Variables y funciones: `camelCase`. Constantes de módulo: `UPPER_SNAKE_CASE`. Tipos e interfaces: `PascalCase`, sin prefijo `I`.
- Identificadores de código y nombres de archivo en **inglés**; **texto visible y comentarios en español**.
- Anclas (`id`) en minúsculas sin acentos, tal como las lista `SYSTEM-ARCHITECTURE.md` §8.

## 3. Estilo de código
- Formateador: Prettier (`npm run format`); linter: ESLint (`npm run lint`); tipos: `npm run check`. Los tres deben terminar sin errores.
- Longitud: línea ≤ 100 caracteres; función ≤ 40 líneas; archivo ≤ 300 líneas (divide si se excede).
- TypeScript `strict`; **prohibido `any`** (usa `unknown` y acota) y `@ts-ignore` (si es inevitable, `@ts-expect-error` con comentario del motivo).
- Importaciones con alias `@/` hacia `src/` en lugar de rutas relativas largas (`../../..`).

## 4. Reglas de arquitectura
- Los componentes de `src/components/` **no contienen texto de negocio**: reciben todo por props. El texto vive en `src/data/`.
- Una sección (`src/sections/`) no importa otra sección.
- `src/scripts/` no importa de `src/data/` ni de Astro; se conecta al DOM solo mediante atributos `data-*` documentados.
- `src/lib/` contiene funciones puras sin DOM ni Astro, con pruebas unitarias.
- No escribas valores de color, tamaño de fuente ni espaciado sueltos: usa los tokens de `global.css` / clases de Tailwind basadas en tokens (Brief §5). Excepción: valores dentro del canvas, importados de constantes con nombre.
- No añadas JavaScript de cliente si CSS o HTML nativo lo resuelven (`<details>` para el acordeón, `:focus-visible`, `scroll-behavior`, etc.).
- Ningún recurso externo en runtime: ni CDN, ni fuentes remotas, ni scripts de terceros (RNF-06).

## 5. Manejo de errores
- Las APIs del navegador que pueden fallar o no existir (`navigator.clipboard`, `matchMedia`, `IntersectionObserver`, `canvas.getContext`) se comprueban antes de usarse; si faltan, la página sigue funcionando sin esa mejora.
- Nunca un `catch` vacío: o se degrada con un mensaje visible al usuario (Brief §7) o se relanza.
- Sin `console.log`/`console.debug` en el código entregado.

## 6. Seguridad
- Nunca escribas secretos, tokens ni credenciales en el código ni en los commits; usa variables de entorno.
- Enlaces externos: `target` solo si es imprescindible y siempre con `rel="noopener noreferrer"`.
- Sin `innerHTML` con contenido no estático; sin `eval` ni `new Function`.
- Añade dependencias solo si están justificadas en la tarea; indica nombre, versión y motivo en el reporte. Prefiere versiones exactas (`--save-exact`) y ejecuta `npm audit` al añadir.
- No añadas analítica, cookies ni almacenamiento local sin que el PRD lo apruebe.

## 7. Pruebas
- Toda funcionalidad nueva incluye pruebas: Vitest para `lib/` y `data/`; Playwright para comportamiento visible en el navegador.
- Las pruebas deben pasar antes de pasar la tarea a «En revisión»: `npm run test`.
- Cobertura mínima de lo nuevo en `lib/` y `data/`: 80 % de líneas; para secciones, al menos una comprobación e2e de sus anclas y contenido clave.
- Los selectores de las pruebas usan roles accesibles o `data-testid`/`data-*`, nunca clases de Tailwind.

## 8. Accesibilidad y rendimiento (siempre, no solo en la fase de calidad)
- HTML semántico: un solo `h1`, jerarquía sin saltos, `button` para acciones y `a` para navegación.
- Todo elemento interactivo es alcanzable y operable con teclado y tiene foco visible.
- Imágenes informativas con `alt`; decorativas con `alt=""` o `aria-hidden="true"`.
- Animaciones solo con `transform` y `opacity`, envueltas en `@media (prefers-reduced-motion: no-preference)`.
- Imágenes con `width` y `height` (evitar CLS); `loading="lazy"` salvo la imagen del hero.
- Presupuesto: JS de cliente total ≤ 60 KB gzip.

## 9. Control de versiones
Aplica solo si el proyecto se versiona con git (hoy no hay repositorio).
- Commits con formato `tipo(ámbito): descripción` (feat, fix, refactor, test, chore, docs).
- Un commit por tarea aprobada, referenciando el ID (`T-012`).

## 10. Documentación en el código
- Comenta el *por qué*, no el *qué*.
- Funciones de `lib/` y scripts de cliente con JSDoc breve en español.
- Cada archivo de `src/data/` indica en un comentario de cabecera de qué parte del README de Jarvis procede el contenido.

## 11. Prohibido
- Modificar archivos dentro de `docs/` (excepto tu bloque de tarea en `PROJECT-TASKS.md`).
- Modificar `docs/CHANGELOG.md` o `.claude/memory.md`.
- Copiar código, textos, imágenes o estilos de otras webs. Los recursos de Jarvis (logo, iconos) sí pueden reutilizarse porque son del mismo autor.
- Modificar el repositorio `C:/Users/willi/Code/Jarvis`: es solo de lectura para esta landing.
- Desactivar linters, comprobaciones de tipos o tests para que «pase».
- Dejar `console.log`, código comentado, `TODO` sin tarea asociada o archivos sin usar.
- Instalar librerías de UI, iconos, animación o frameworks de componentes (React, Vue, etc.) sin aprobación expresa del orquestador.
- Hacer `git push`, publicar o desplegar el sitio; eso solo lo decide el usuario.

## 12. Definition of Done
Una tarea está terminada cuando se cumple **todo** lo siguiente:
- [ ] Los criterios de aceptación de la tarea se cumplen uno por uno.
- [ ] El código sigue estas reglas y la arquitectura documentada.
- [ ] Hay pruebas y todas pasan (`npm run test`).
- [ ] Lint y tipos sin errores (`npm run lint` y `npm run check`).
- [ ] El build compila (`npm run build`).
- [ ] El texto visible es veraz respecto al README de Jarvis (regla 1.5).
- [ ] No se tocaron archivos fuera del alcance de la tarea.
- [ ] El reporte del subagente está completo en `PROJECT-TASKS.md`.
