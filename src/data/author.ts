/**
 * Textos de las secciones Autor y CTA final.
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), pie final
 * («Hecho por Williams Villavizar: desarrollador web en Santo Domingo,
 * República Dominicana. Ver portafolio») y cabecera (descripción).
 * Las URLs viven en `site.ts`.
 */
export const AUTHOR = {
  eyebrow: 'Autor',
  title: 'Sobre el autor',
  madeBy: 'Hecho por',
  role: 'Desarrollador web en Santo Domingo, República Dominicana.',
  portfolioLabel: 'Ver portafolio',
} as const;

export const FINAL_CTA = {
  title: 'Empieza con Jarvis',
  text: 'Asistente de voz personal que corre en tu propio PC. Revisa el proyecto o sigue los pasos de instalación.',
  githubLabel: 'Ver en GitHub',
  installLabel: 'Cómo se instala',
  installHref: '#instalacion',
} as const;
