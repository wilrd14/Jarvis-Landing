/**
 * Preguntas frecuentes.
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), apartados «Instalación en
 * Windows», «Seguridad», «Costes», «Skills» y «Usarlo desde el celular»; lista de preguntas
 * del PRD RF-14. Donde el README no dice nada, la respuesta lo admite.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ = {
  eyebrow: 'FAQ',
  title: 'Preguntas frecuentes',
  items: [
    {
      question: '¿Necesita internet?',
      answer:
        'Las respuestas y la voz pasan por OpenRouter, así que para eso hace falta conexión. ' +
        'Las órdenes instantáneas (volumen, abrir apps, capturas, temporizadores…) se ' +
        'resuelven en tu PC, sin IA y sin coste.',
    },
    {
      question: '¿Cuánto cuesta?',
      answer:
        'Todo pasa por OpenRouter y se paga por uso. Las órdenes locales no cuestan nada, ' +
        'y Jarvis muestra tu saldo real y puede bloquearse al llegar a un tope mensual.',
    },
    {
      question: '¿Funciona en Mac o Linux?',
      answer: 'Por ahora Jarvis solo funciona en Windows.',
    },
    {
      question: '¿Mis datos salen de mi PC?',
      answer:
        'El servidor de Jarvis solo escucha en tu equipo y tus API keys no salen de él ni se ' +
        'escriben en logs. Como las consultas al modelo pasan por OpenRouter, ese contenido ' +
        'se envía a ese servicio para procesarse. Los documentos se guardan solo en ' +
        'Documentos\\Jarvis y sin sobrescribir nada.',
    },
    {
      question: '¿Qué es OpenRouter?',
      answer:
        'Es el servicio por el que pasan los modelos que usa Jarvis, y se paga por uso. ' +
        'Necesitas tu propia API key de OpenRouter, que pegas en Ajustes.',
    },
    {
      question: '¿Puedo crear mis propias skills?',
      answer:
        'Sí, desde Ajustes. Una skill es un archivo .md suelto o una carpeta con SKILL.md, ' +
        'con instrucciones que Jarvis aplica al redactar. Solo se leen instrucciones: nunca ' +
        'se ejecuta código de una skill.',
    },
    {
      question: '¿Puedo usarlo desde el celular?',
      answer:
        'Sí, con Tailscale: abres Jarvis desde el móvil como una app, dentro de tu red ' +
        'privada y sin exponerlo a internet. El PC tiene que estar encendido y sin suspenderse.',
    },
  ] satisfies FaqItem[],
} as const;
