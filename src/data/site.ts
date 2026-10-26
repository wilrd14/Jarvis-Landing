/**
 * Configuración del sitio.
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), cabecera
 * (eslogan y descripción) y Brief UX/UI §12.13 (autor y enlaces).
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  lang: 'es';
  author: string;
  githubUrl: string;
  portfolioUrl: string;
  /** Marcador provisional: se define al desplegar (PRD Q-03). */
  canonicalUrl: string;
  /** Ruta de la imagen social (1200×630) dentro de public/. */
  ogImage: string;
  ogImageAlt: string;
}

export const SITE: SiteConfig = {
  name: 'Jarvis',
  tagline: 'Asistente de voz personal con núcleo holográfico, que corre en tu propio PC.',
  description:
    'Asistente de voz personal con núcleo holográfico, que corre en tu propio PC. ' +
    'Hablas, te responde en voz alta y hace cosas reales: abrir apps, crear documentos, ' +
    'recordarte cosas o ver tu pantalla.',
  lang: 'es',
  author: 'Williams Villavizar',
  githubUrl: 'https://github.com/wilrd14/Jarvis',
  portfolioUrl: 'https://wilrd14.dev',
  canonicalUrl: 'https://jarvis.wilrd14.dev',
  ogImage: '/og-image.png',
  ogImageAlt: 'Logotipo de Jarvis con su nombre y eslogan: asistente de voz personal para tu PC.',
};
