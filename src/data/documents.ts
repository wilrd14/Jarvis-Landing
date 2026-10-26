/**
 * Sección «Documentos».
 * Fuente: README de Jarvis, sección «Documentos» (formatos, carpeta, coste estimado).
 * Los puntos siguen Brief UX/UI §12.6.
 */
import type { IconName } from '@/components/icons';

export interface DocumentFormat {
  label: string;
  icon: IconName;
}

export const DOCUMENTS_SECTION = {
  id: 'documentos-title',
  eyebrow: 'Documentos',
  title: 'Crea documentos hablando',
  intro: 'Dicta lo que necesitas y Jarvis genera el archivo en el formato que prefieras.',
} as const;

export const DOCUMENT_FORMATS: readonly DocumentFormat[] = [
  { label: 'Word', icon: 'file' },
  { label: 'PDF', icon: 'file' },
  { label: 'Excel', icon: 'sheet' },
  { label: 'PowerPoint', icon: 'slides' },
  { label: 'Markdown', icon: 'note' },
  { label: 'HTML', icon: 'globe' },
  { label: 'Texto', icon: 'note' },
  { label: 'CSV', icon: 'sheet' },
];

export const DOCUMENT_POINTS = {
  folder: { before: 'Se guardan en ', path: 'Documentos\\Jarvis', after: ' sin sobrescribir nada' },
  drafting: 'Redacta con IA o con tu contenido dictado',
  cost: 'La tarjeta muestra el coste estimado antes de confirmar',
} as const;

export const COST_MOCKUP = {
  title: 'Coste estimado',
  rows: [
    { label: 'Contenido ya dictado', value: 'Sin coste' },
    { label: 'Jarvis lo redacta', value: 'Máximo ~ estimado' },
  ],
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  note: 'Maqueta ilustrativa',
} as const;
