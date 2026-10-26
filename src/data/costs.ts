/**
 * Sección Costes (#costes).
 * Fuente: README de Jarvis, apartado «Costes»; Brief UX/UI §12.10; PRD RF-09.
 * Sin precios: el README no los da.
 */
import type { IconName } from '@/components/icons';

export interface CostBlock {
  icon: IconName;
  title: string;
  text: string;
}

export const COSTS_HEADING = {
  eyebrow: 'Costes',
  title: 'Pagas solo lo que usas',
  intro: 'El gasto depende de cuánto uses a Jarvis, y tú controlas el límite.',
} as const;

export const COST_BLOCKS: readonly CostBlock[] = [
  {
    icon: 'coin',
    title: 'Pago por uso con OpenRouter',
    text: 'Todo pasa por OpenRouter y se paga por uso.',
  },
  {
    icon: 'bolt',
    title: 'Lo local es gratis',
    text: 'Las órdenes locales no cuestan nada.',
  },
  {
    icon: 'timer',
    title: 'Tú pones el tope',
    text: 'Jarvis muestra tu saldo real y puede bloquearse al llegar a un tope mensual. Además, el modelo rápido y la caché de voz reducen el gasto.',
  },
];
