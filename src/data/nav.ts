/**
 * Navegación y textos de cabecera/pie.
 * Fuente: Brief UX/UI §12.1 y §12.14; anclas según SYSTEM-ARCHITECTURE §8.
 * Los enlaces externos y el autor salen de `site.ts` (README de Jarvis, autor y portafolio).
 */
export interface NavItem {
  label: string;
  href: `#${string}`;
  /** Ids de sección que activan este enlace al resaltar (por defecto, solo el suyo). */
  matches?: readonly string[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Capacidades',
    href: '#voz',
    matches: ['voz', 'instantaneas', 'acciones', 'documentos', 'skills', 'movil'],
  },
  { label: 'Seguridad', href: '#seguridad' },
  { label: 'Costes', href: '#costes' },
  { label: 'Instalación', href: '#instalacion' },
  { label: 'FAQ', href: '#faq' },
];

export const NAV_LABELS = {
  homeAria: 'Jarvis, ir al inicio',
  navAria: 'Principal',
  menuOpen: 'Abrir menú',
  menuClose: 'Cerrar menú',
  github: 'Ver en GitHub',
} as const;

export const FOOTER_LABELS = {
  navAria: 'Enlaces del pie',
  github: 'GitHub',
  portfolio: 'Portafolio',
  madeBy: 'Hecho por',
} as const;
