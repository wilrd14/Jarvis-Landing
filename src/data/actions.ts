/**
 * Sección «Acciones sobre tu PC» y «Entiende tu pantalla».
 * Fuente: README de Jarvis, secciones «Acciones sobre tu PC» y «Entiende tu pantalla».
 * Agrupación en tres bloques según Brief UX/UI §12.5.
 */
import type { IconName } from '@/components/icons';

export interface ActionItem {
  label: string;
  icon: IconName;
}

export interface ActionGroup {
  title: string;
  items: readonly ActionItem[];
}

export const ACTIONS_SECTION = {
  id: 'acciones-title',
  eyebrow: 'Acciones',
  title: 'Acciones sobre tu PC',
  intro:
    'Jarvis no solo conversa: hace cosas reales en tu equipo. Las acciones con efecto piden confirmación con una tarjeta.',
} as const;

export const ACTION_GROUPS: readonly ActionGroup[] = [
  {
    title: 'Comunicación',
    items: [
      { label: 'Correo', icon: 'mail' },
      { label: 'Calendario', icon: 'calendar' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Abrir apps', icon: 'app' },
      { label: 'Abrir carpetas', icon: 'folder' },
      { label: 'Abrir páginas', icon: 'globe' },
      { label: 'Buscar y abrir archivos', icon: 'search' },
      { label: 'Portapapeles', icon: 'clipboard' },
      { label: 'Volumen', icon: 'volume' },
      { label: 'Bloqueo de pantalla', icon: 'lock' },
      { label: 'Capturas', icon: 'camera' },
      { label: 'Notas', icon: 'note' },
    ],
  },
  {
    title: 'Tiempo',
    items: [
      { label: 'Recordatorios', icon: 'bell' },
      { label: 'Temporizadores', icon: 'timer' },
      { label: 'Alarmas', icon: 'clock' },
      { label: 'Resumen del día (clima, agenda y recordatorios)', icon: 'sun' },
    ],
  },
];

export const SCREEN_FEATURE = {
  icon: 'eye',
  eyebrow: 'Entiende tu pantalla',
  title: '«¿Qué estoy viendo?»',
  body: 'Jarvis captura la pantalla y la analiza con un modelo de visión.',
} as const;

export const CONFIRM_MOCKUP = {
  caption: 'Las acciones con efecto piden confirmación',
  title: 'Confirmación',
  description: 'Descripción de la acción que Jarvis va a ejecutar',
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  note: 'Maqueta ilustrativa',
} as const;
