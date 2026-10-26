/**
 * Sección «Conversación por voz» (#voz).
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), «Qué hace › Conversación por voz».
 */
import type { IconName } from '@/components/icons';

export interface VoicePoint {
  icon: IconName;
  title: string;
  text: string;
}

export const VOICE = {
  eyebrow: 'Conversación por voz',
  title: 'Hablas, Jarvis responde en voz alta',
  intro: 'Sin mantener nada pulsado y sin esperar a que termine de pensar para empezar a hablar.',
  points: [
    {
      icon: 'mic',
      title: 'Entrada automática',
      text: 'Hablas y, cuando haces una pausa, Jarvis procesa el audio. No hay que mantener nada pulsado.',
    },
    {
      icon: 'wave',
      title: 'Voz en tiempo real',
      text: 'Empieza a hablar frase por frase mientras todavía piensa la respuesta, con la cola de audio sin cortes.',
    },
    {
      icon: 'chat',
      title: 'Modo conversación',
      text: 'Reabre el micrófono solo tras responder, para hablar de seguido.',
    },
    {
      icon: 'bolt',
      title: 'Modelo según la pregunta',
      text: 'Un modelo rápido y barato para charla y órdenes sencillas, y uno potente para lo difícil.',
    },
  ] satisfies VoicePoint[],
  mockup: {
    caption: 'Ilustración de una conversación',
    userLabel: 'Tú',
    assistantLabel: 'Jarvis',
    userText: 'Jarvis, ¿qué hora es?',
    assistantText: 'Respondiendo en voz alta…',
  },
};
