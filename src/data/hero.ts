import { SITE } from '@/data/site';

/**
 * Contenido del Hero.
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md): cabecera
 * (eslogan, «Next.js 16 · … · OpenRouter») y «Instalación en Windows».
 * La etiqueta «Código abierto» queda fuera hasta resolver PRD Q-01.
 */
export interface HeroContent {
  eyebrow: string;
  title: string;
  tagline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  tags: string[];
}

export const HERO: HeroContent = {
  eyebrow: 'Asistente de voz · en español · en tu PC',
  title: SITE.name,
  tagline: SITE.tagline,
  primaryCta: { label: 'Ver en GitHub', href: SITE.githubUrl },
  secondaryCta: { label: 'Cómo se instala', href: '#instalacion' },
  tags: ['Next.js 16', 'OpenRouter', 'Windows'],
};
