/**
 * Contenido de la sección Instalación.
 * Fuente: README de Jarvis (C:/Users/willi/Code/Jarvis/README.md), apartado
 * «Instalación en Windows»; Brief UX/UI §12.11.
 */
export interface InstallStep {
  title: string;
  description: string;
  /** Comandos que se copian con el botón; ausente si el paso no tiene comandos. */
  commands?: string[];
}

export const INSTALL = {
  eyebrow: 'Instalación',
  title: 'Instala Jarvis en Windows',
  intro:
    'Jarvis corre como programa local: un servidor en 127.0.0.1:3737 y una ventana de ' +
    'Edge/Chrome en modo aplicación.',
  requirements: {
    title: 'Requisitos',
    items: [
      'Windows 10/11 con Microsoft Edge o Google Chrome (Edge viene con Windows).',
      'Node.js 20 o superior (versión LTS) y Git.',
      'Una API key de OpenRouter con algo de saldo: todo (chat, voz y visión) pasa por ahí.',
      'Un micrófono.',
    ],
  },
  steps: <InstallStep[]>[
    {
      title: 'Clona el repositorio e instala las dependencias',
      description: 'En una terminal, ejecuta:',
      commands: ['git clone https://github.com/wilrd14/Jarvis.git', 'cd Jarvis', 'npm install'],
    },
    {
      title: 'Compila y crea el acceso directo',
      description:
        'Tarda unos minutos la primera vez. Al terminar encontrarás «Jarvis» en el Escritorio ' +
        'y en el menú Inicio, con el atajo Ctrl+Alt+J.',
      commands: ['npm run app:install'],
    },
    {
      title: 'Pega tu API key de OpenRouter',
      description:
        'Abre Jarvis desde el acceso directo (o con Ctrl+Alt+J) y entra en Ajustes. La key se ' +
        'guarda en %APPDATA%\\Jarvis\\settings.json, nunca en el repositorio.',
    },
    {
      title: 'Permite el micrófono y empieza a hablar',
      description: 'Permite el micrófono cuando el navegador lo pida y empieza a hablar.',
    },
  ],
  note: {
    title: 'Solo para Windows',
    text:
      'No hay un .exe sin firmar, así que Jarvis funciona con Smart App Control activado ' +
      'y no toca ninguna protección de Windows.',
  },
  autostart: {
    text: 'Arranque con Windows (opcional):',
    commands: ['npm run app:autostart:on', 'npm run app:autostart:off'],
  },
  copy: {
    copyLabel: 'Copiar',
    copiedLabel: 'Copiado',
    errorLabel: 'No se pudo copiar. Selecciona el texto.',
    buttonAriaLabel: 'Copiar comando',
  },
} as const;
