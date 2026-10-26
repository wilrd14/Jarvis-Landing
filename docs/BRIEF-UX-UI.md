# Brief UX & UI — Jarvis Landing

| Campo | Valor |
|---|---|
| Versión | 0.1 |
| Fecha | 2026-10-21 |

## 1. Principios de experiencia
1. **Claridad antes que espectáculo.** El holograma atrae, pero el visitante debe entender qué es Jarvis sin esperar a ninguna animación.
2. **Coherencia con el producto.** La página usa la misma identidad que la app (negro verdoso, esmeralda y turquesa, estética HUD), para que el visitante reconozca lo que luego instalará.
3. **Honestidad.** Se muestra lo que Jarvis hace hoy, con sus límites (solo Windows, pago por uso). Sin promesas ni cifras inventadas.
4. **Ligera y accesible.** Poco JavaScript, contraste alto, teclado completo y movimiento reducible: la página predica el mismo cuidado que el producto.
5. **Un camino principal.** Toda la página empuja hacia una acción: ver el repositorio. Lo demás son rutas de apoyo.

## 2. Usuarios y contexto de uso
Personas del PRD §5 (P1 desarrollador, P2 usuario de Windows, P3 reclutador/cliente).
- **Dispositivos:** móvil (llegan desde enlaces en redes) y escritorio (desarrolladores). Diseño mobile-first.
- **Tiempo de atención:** 10–30 s para decidir si siguen. El hero y las dos secciones siguientes deben bastar.
- **Frecuencia:** visita única o esporádica. No hay estado ni cuentas.

## 3. Arquitectura de información
Página única con anclas:

```
/
├── Cabecera fija (logo · Capacidades · Seguridad · Costes · Instalación · FAQ · [Ver en GitHub])
├── #inicio        Hero (holograma + eslogan + CTAs)
├── #voz           Conversación por voz
├── #instantaneas  Órdenes instantáneas (sin IA, sin coste)
├── #acciones      Acciones sobre tu PC y entiende tu pantalla
├── #documentos    Documentos en 8 formatos
├── #skills        Skills y memoria a largo plazo
├── #movil         Usarlo desde el celular (Tailscale)
├── #seguridad     Seguridad
├── #costes        Costes
├── #instalacion   Instalación en Windows
├── #faq           Preguntas frecuentes
├── #autor         Sobre el autor
├── CTA final
└── Pie de página
```
Orden narrativo: qué es → qué hace (de lo cotidiano a lo avanzado) → por qué confiar → cuánto cuesta → cómo empezar → dudas → quién lo hizo.

## 4. Flujos de usuario
Ver flujos del PRD §10. Caminos de error relevantes:
- **JavaScript desactivado:** la página es legible y navegable (el menú móvil, el botón de copiar y el holograma son mejoras progresivas; sin JS el holograma muestra la imagen estática y los comandos siguen visibles).
- **Copiar falla** (sin permisos del portapapeles): el botón informa «No se pudo copiar, selecciona el texto» y el bloque queda seleccionable.
- **Ancla inexistente:** no aplica; todas las anclas se prueban en e2e.

## 5. Sistema visual
Estética: **HUD holográfico sobrio**. Fondo casi negro con brillo esmeralda localizado, líneas finas, esquinas con marcas tipo HUD, mucho espacio en blanco (oscuro). Nada de neón saturado en bloques grandes de texto.

### 5.1 Color (tokens)
Tomados de la paleta de Jarvis. Tema único oscuro (la app es oscura; no hay tema claro en el MVP) y se declara `color-scheme: dark`.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--color-background` | `#030504` | Fondo de página | — |
| `--color-panel` | `#06100d` | Tarjetas, secciones alternas | — |
| `--color-panel-raised` | `#0b1a15` | Tarjeta en hover, bloques de código | — |
| `--color-border` | `#143229` | Bordes finos | decorativo |
| `--color-foreground` | `#eafff5` | Texto principal | ≈ 19:1 sobre fondo |
| `--color-muted` | `#9fc4b6` | Texto secundario | ≈ 10:1 sobre fondo |
| `--color-core` | `#e8fff6` | Núcleo del holograma, titulares destacados | — |
| `--color-emerald` | `#1fe0a0` | Acento principal, enlaces, CTA | ≈ 11:1 sobre fondo |
| `--color-turquoise` | `#14c4c4` | Acento secundario, degradados | ≈ 9:1 sobre fondo |
| `--color-spark` | `#2bffb8` | Destellos, foco visible | — |
| `--color-ghost` | `#2e8878` | Solo decorativo o texto ≥ 24 px (≈ 4,7:1 sobre fondo, < 4,5:1 sobre panel) | limitado |
| `--color-danger` | `#ff6b6b` | Errores (copiar fallido, etc.) | ≥ 7:1 sobre fondo |

Reglas: el texto del cuerpo usa `foreground` o `muted`; `ghost` nunca para texto pequeño. El agente debe verificar con una herramienta cualquier combinación nueva (mínimo 4,5:1). Botón primario: fondo `emerald`, texto `#030504` (≈ 11,9:1).

### 5.2 Tipografía
Fuentes autoalojadas (sin peticiones a terceros), las mismas que usa Jarvis: **Space Grotesk** (títulos), **Geist** (cuerpo) y **JetBrains Mono** (código y etiquetas técnicas).

| Rol | Fuente | Tamaño (móvil → escritorio) | Peso | Interlineado |
|---|---|---|---|---|
| Título 1 (hero) | Space Grotesk | 40 → 72 px (`clamp`) | 700 | 1,05 |
| Título 2 (sección) | Space Grotesk | 30 → 44 px | 600 | 1,15 |
| Título 3 (tarjeta) | Space Grotesk | 20 → 22 px | 600 | 1,3 |
| Cuerpo | Geist | 16 → 18 px | 400 | 1,65 |
| Cuerpo pequeño | Geist | 14 px | 400 | 1,5 |
| Etiqueta / eyebrow | JetBrains Mono | 12–13 px, mayúsculas, tracking 0,12em | 500 | 1,4 |
| Código | JetBrains Mono | 14 px | 400 | 1,6 |

Máximo 70 caracteres por línea en párrafos. Usar `font-display: swap` y precargar solo las fuentes del hero.

### 5.3 Espaciado, bordes y sombras
- Escala de espaciado: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px.
- Ancho máximo del contenedor: 1200 px; gutter lateral: 16 px (móvil), 24 px (tablet), 32 px (escritorio).
- Separación vertical entre secciones: 96 px (móvil), 128 px (escritorio).
- Radios: 8 px (botones, bloques de código), 16 px (tarjetas), 9999 px (etiquetas).
- Bordes: 1 px `--color-border`; en hover, borde `emerald` al 40 % de opacidad.
- Sombras: sin sombras negras; el relieve se logra con brillo: `0 0 32px rgb(31 224 160 / 0.15)` en tarjetas destacadas y `0 0 64px rgb(43 255 184 / 0.25)` alrededor del holograma.

### 5.4 Iconografía e imágenes
- Logo: `logo.svg` de Jarvis (copiar desde `C:/Users/willi/Code/Jarvis/public/logo.svg`) y los iconos PNG existentes para favicon.
- Iconos de capacidad: SVG en línea de trazo fino (1,5 px, esquinas redondeadas), color `emerald`, creados para el proyecto (sin librerías externas, para no sumar peso ni dependencias).
- Ilustración: maquetas de interfaz hechas en HTML/CSS (tarjeta de confirmación de acción, burbuja de conversación, panel de ajustes) mientras no existan capturas reales (PRD Q-02). Todo elemento decorativo lleva `aria-hidden="true"`; las imágenes informativas, texto alternativo.
- Imagen social (OG): 1200×630, fondo negro, logo, nombre y eslogan.

## 6. Componentes
| Componente | Variantes | Estados | Comportamiento |
|---|---|---|---|
| `Button` | primario (relleno esmeralda), secundario (borde esmeralda), enlace | normal, hover, foco, activo, deshabilitado | Mínimo 44×44 px de área táctil; el foco muestra un anillo de 2 px `spark` con 2 px de separación |
| `Container` | — | — | Centra y limita el ancho; aplica gutters |
| `SectionHeading` | con eyebrow / sin eyebrow | — | Eyebrow mono + `h2` + párrafo introductorio |
| `Card` | normal, destacada | normal, hover | Borde fino con esquinas HUD; hover sube el borde y el brillo; sin elevar por transform si hay `reduced-motion` |
| `Badge` | neutra, acento | — | Etiquetas como «Sin IA», «Sin coste», «Windows» |
| `CodeBlock` | una línea / varias | normal, copiado, error | Botón «Copiar» accesible (`aria-live="polite"` para «Copiado»); desplazable en horizontal si hace falta, sin romper el layout |
| `Header` | transparente al inicio, con fondo al hacer scroll | menú cerrado/abierto | Fija; en móvil, botón hamburguesa con `aria-expanded` y panel a pantalla completa; Esc cierra |
| `FeatureGrid` | 2 y 3 columnas | — | Rejilla de `Card` |
| `Steps` | vertical numerada | — | Pasos con número grande en mono (para instalación y Tailscale) |
| `Faq` | acordeón con `<details>` | cerrado, abierto | Semántica nativa; teclado de serie |
| `HologramCore` | animado / estático | animación, pausa, estático | Canvas; ver Brief §12 (Hero) |
| `Footer` | — | — | Enlaces, año, créditos |

## 7. Estados de la interfaz
Es una página estática; los estados relevantes:
| Situación | Qué se muestra | Texto |
|---|---|---|
| Copiar correcto | El botón cambia a estado «copiado» 2 s | «Copiado» |
| Copiar falla | El botón cambia a estado de error y el texto queda seleccionado | «No se pudo copiar. Selecciona el texto.» |
| Sin JavaScript | Contenido íntegro; holograma estático; menú móvil como lista de enlaces visible | — |
| `prefers-reduced-motion` | Sin animación de partículas, sin entradas animadas, sin parallax | — |
| Fuente tardando | Se muestra la fuente de sistema hasta que cargue (`swap`), con métricas ajustadas para evitar saltos | — |
| Enlace externo | Icono de salida discreto y `rel="noopener noreferrer"` | — |

## 8. Diseño responsivo
| Breakpoint | Ancho | Cambios principales |
|---|---|---|
| Móvil | 320–767 px | Una columna; menú hamburguesa; hero con holograma encima del texto y CTAs apilados a ancho completo; rejillas de 1 columna |
| Tablet | 768–1023 px | Rejillas de 2 columnas; cabecera con enlaces compactos; hero en una columna centrada |
| Escritorio | ≥ 1024 px | Hero en dos columnas (texto a la izquierda, holograma a la derecha); rejillas de 3 columnas; cabecera completa |

Sin scroll horizontal en ningún ancho de 320 a 1920 px. Los bloques de código se desplazan dentro de su caja.

## 9. Accesibilidad
Meta: **WCAG 2.1 AA**.
- Un solo `h1` (hero); jerarquía de títulos sin saltos.
- Landmarks: `header`, `nav` (con `aria-label`), `main`, `section` con `aria-labelledby`, `footer`. Enlace «Saltar al contenido» como primer elemento focusable.
- Foco visible en todo elemento interactivo (anillo `spark` de 2 px); orden de tabulación lógico.
- Contraste mínimo 4,5:1 para texto normal y 3:1 para texto grande y componentes de interfaz.
- Área táctil mínima de 44×44 px.
- El canvas del holograma es decorativo: `aria-hidden="true"`; la información nunca depende de él.
- Menú móvil: `aria-expanded`, `aria-controls`, cierre con Esc, devuelve el foco al botón.
- `prefers-reduced-motion` desactiva animaciones; ninguna animación parpadea más de 3 veces por segundo.
- Enlaces con texto descriptivo (no «clic aquí»); los que abren una web externa lo indican.
- Atributo `lang="es"` en `<html>`.

## 10. Contenido y microcopy
- **Tono:** cercano, directo, técnico sin jerga innecesaria; tuteo («tu PC», «tú»). Frases cortas. Sin exageraciones («revolucionario», «el mejor») ni emojis en titulares.
- **Verbos concretos:** «Hablas, te responde en voz alta y hace cosas reales».
- **Honestidad explícita:** decir «Windows», «se paga por uso con OpenRouter», «el PC tiene que estar encendido».
- **Fuente única:** todo el texto sale del README de Jarvis (PRD §7); se centraliza en `src/data/` para poder actualizarlo sin tocar componentes.
- **Ejemplos:**
  - CTA principal: «Ver en GitHub». CTA secundario: «Cómo se instala».
  - Etiquetas: «Sin IA · sin coste», «Solo en tu PC», «Pago por uso».
  - Copiar: «Copiar» → «Copiado».
  - Error: «No se pudo copiar. Selecciona el texto.»

## 11. Referencias visuales
- **La propia app Jarvis** (`HologramCore.tsx`, `globals.css`, `logo.svg`): paleta, anillos segmentados con marcas HUD y partículas. Es la referencia principal.
- **Landings de herramientas para desarrolladores** (Linear, Raycast, Vercel): jerarquía clara, secciones con una idea cada una, bloques de código elegantes. Se toma la estructura, no el diseño.
- No se copian recursos ni estilos de terceros.

## 12. Especificación por pantalla
Una sola página; cada sección es una «pantalla». Todas usan `SectionHeading` (eyebrow + h2 + intro) salvo el hero.

### 12.1 Cabecera
Logo + nombre a la izquierda; enlaces ancla (Capacidades, Seguridad, Costes, Instalación, FAQ) y botón «Ver en GitHub»; al hacer scroll gana fondo `background` al 80 % con desenfoque. Resalta el enlace de la sección visible (IntersectionObserver). En móvil: botón de menú.

### 12.2 Hero (`#inicio`)
- **Contenido:** eyebrow «Asistente de voz · en español · en tu PC»; `h1` «Jarvis»; subtítulo con el eslogan del README; dos CTAs; fila de datos verificables como etiquetas («Next.js 16», «OpenRouter», «Windows», «Código abierto en GitHub» solo si Q-01 se confirma); `HologramCore`.
- **Holograma:** canvas cuadrado (máx. 520 px), anillos segmentados + partículas esmeralda/turquesa/blanco-verdoso que giran suavemente; respira en reposo. Número de partículas proporcional al área (máx. 220 en escritorio, 90 en móvil). Pausa con `IntersectionObserver` y con `document.hidden`. Con `reduced-motion`, un fotograma estático.
- **Acciones:** «Ver en GitHub» (primario, externo) y «Cómo se instala» (secundario, ancla `#instalacion`).

### 12.3 Conversación por voz (`#voz`)
Rejilla de 4 tarjetas: Entrada automática, Voz en tiempo real, Modo conversación, Modelo según la pregunta. Ilustración: burbujas de conversación en HTML/CSS con una onda de audio decorativa.

### 12.4 Órdenes instantáneas (`#instantaneas`)
Titular con `Badge` «Sin IA · sin coste». Rejilla de 8 mini-tarjetas con icono: volumen, carpetas y apps, captura, bloqueo, temporizadores, notas, hora y fecha, saludos.

### 12.5 Acciones y pantalla (`#acciones`)
Lista agrupada de capacidades (comunicación: correo y calendario; sistema: apps, carpetas, archivos, portapapeles, bloqueo; tiempo: recordatorios, temporizadores, alarmas, resumen del día). Destacada: «¿Qué estoy viendo?», análisis de pantalla con modelo de visión. Maqueta de la tarjeta de confirmación con la nota «Las acciones con efecto piden confirmación».

### 12.6 Documentos (`#documentos`)
Texto + rejilla de 8 `Badge` con los formatos. Tres puntos: «Se guardan en `Documentos\Jarvis` sin sobrescribir nada», «Redacta con IA o con tu contenido dictado», «La tarjeta muestra el coste estimado antes de confirmar». Maqueta de la tarjeta de coste.

### 12.7 Skills y memoria (`#skills`)
Dos columnas. Skills: explicación + lista de las 7 incluidas (informe formal, carta formal, acta de reunión, resumen ejecutivo, CV, propuesta comercial, informe universitario) + «solo se leen instrucciones, nunca se ejecuta código». Memoria: «recuerda que…», se usa en conversaciones futuras, se puede desactivar y borrar.

### 12.8 Móvil (`#movil`)
`Steps` de 3 pasos (instalar Tailscale en PC y celular; publicar y definir PIN en Ajustes; abrir la dirección `.ts.net` y añadir a la pantalla de inicio). Nota de aviso: el PC debe estar encendido y sin suspenderse; las acciones se ejecutan en el PC.

### 12.9 Seguridad (`#seguridad`)
Rejilla de 6 tarjetas con las garantías (PRD RF-08) en lenguaje claro, cada una con una frase técnica secundaria en mono. Sin jerga sin explicar: «loopback» se explica como «solo escucha dentro de tu equipo».

### 12.10 Costes (`#costes`)
Tres bloques: «Pago por uso con OpenRouter», «Lo local es gratis», «Tú pones el tope» (saldo real, tope mensual con bloqueo, caché de voz). Sin precios concretos.

### 12.11 Instalación (`#instalacion`)
`Steps`: 1) clonar e instalar: `npm install`; 2) `npm run app:install` (crea el acceso directo «Jarvis», atajo Ctrl+Alt+J); 3) en Ajustes, pegar la API key de OpenRouter. `CodeBlock` con botón de copiar en cada comando. Nota: funciona en Windows; no hay `.exe` sin firmar, por eso encaja con Smart App Control.

### 12.12 FAQ (`#faq`)
Acordeón `<details>` con las preguntas del PRD RF-14. Respuestas basadas en el README; si algo no está documentado (por ejemplo, funcionamiento sin internet), la respuesta lo dice con honestidad.

### 12.13 Autor (`#autor`)
Tarjeta «Hecho por Williams Villavizar, desarrollador web en Santo Domingo, República Dominicana» con enlace a `https://wilrd14.dev` («Ver portafolio»).

### 12.14 CTA final y pie
Bloque centrado: titular breve, «Ver en GitHub» y «Cómo se instala». Pie: logo, enlaces (GitHub, Portafolio), año y «Hecho por Williams Villavizar».
