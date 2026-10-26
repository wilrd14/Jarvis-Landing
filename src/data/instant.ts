/**
 * Sección «Órdenes instantáneas» (#instantaneas).
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), «Órdenes instantáneas (sin IA, sin coste)».
 */
import type { IconName } from '@/components/icons';

export interface InstantCommand {
  icon: IconName;
  label: string;
}

export const INSTANT = {
  eyebrow: 'Órdenes instantáneas',
  title: 'Lo sencillo se resuelve al momento',
  intro: 'Estas órdenes se ejecutan en local: no usan IA y no cuestan nada.',
  badge: 'Sin IA · sin coste',
  commands: [
    { icon: 'volume', label: 'Volumen' },
    { icon: 'folder', label: 'Abrir carpetas y apps' },
    { icon: 'camera', label: 'Captura de pantalla' },
    { icon: 'lock', label: 'Bloquear el equipo' },
    { icon: 'timer', label: 'Temporizadores' },
    { icon: 'note', label: 'Notas' },
    { icon: 'clock', label: 'Hora y fecha' },
    { icon: 'hand', label: 'Saludos' },
  ] satisfies InstantCommand[],
};
