/**
 * Sección «Skills y memoria» (`#skills`).
 * Fuente: README de Jarvis, apartados «Skills» y «Memoria a largo plazo».
 */
import type { IconName } from '@/components/icons';

export const SKILLS_HEADING = {
  eyebrow: 'Skills y memoria',
  title: 'Instrucciones que aplica y cosas que recuerda',
  intro:
    'Las skills le dicen a Jarvis cómo redactar cada documento. La memoria guarda lo que le pides que recuerde.',
} as const;

export const SKILLS_COLUMN = {
  icon: 'puzzle' satisfies IconName,
  title: 'Skills',
  description:
    'Son instrucciones en Markdown que Jarvis aplica al redactar. Una skill puede ser un archivo .md suelto o una carpeta con SKILL.md. Trae 7 en español y puedes crear las tuyas desde Ajustes.',
  listLabel: 'Skills incluidas',
  items: [
    'Informe formal',
    'Carta formal',
    'Acta de reunión',
    'Resumen ejecutivo',
    'CV',
    'Propuesta comercial',
    'Informe universitario',
  ],
  note: 'Solo se leen instrucciones: nunca se ejecuta código de una skill.',
} as const;

export const MEMORY_COLUMN = {
  icon: 'brain' satisfies IconName,
  title: 'Memoria a largo plazo',
  description:
    'Recuerda lo que le pides que recuerde («recuerda que…») y lo usa en conversaciones futuras.',
  propertiesLabel: 'Control de la memoria',
  properties: ['Se puede desactivar', 'Se puede borrar'],
} as const;
