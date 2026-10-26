/**
 * Sección «Desde el celular» (`#movil`).
 * Fuente: README de Jarvis, apartados «Usarlo desde el celular, en privado» y
 * «Usarlo desde el celular (Tailscale)».
 */
export const MOBILE_HEADING = {
  eyebrow: 'Desde el celular',
  title: 'Úsalo desde el celular, en privado',
  intro:
    'Con Tailscale abres Jarvis desde el móvil como una app, sin exponerlo a internet: solo tus dispositivos pueden abrirlo.',
} as const;

export const MOBILE_STEPS = [
  {
    title: 'Instala Tailscale',
    description: 'Instálalo en el PC y en el celular, con la misma cuenta.',
  },
  {
    title: 'Publica Jarvis y define un PIN',
    description:
      'En Jarvis, entra en Ajustes y busca «Usar Jarvis en el celular (privado)». Usa la dirección detectada, pulsa «Publicar» (HTTPS, necesario para el micrófono), define un PIN y activa el interruptor.',
  },
  {
    title: 'Ábrelo en el celular',
    description:
      'Abre la dirección https://<tu-pc>.<tu-red>.ts.net, introduce el PIN y añádela a la pantalla de inicio.',
  },
] as const;

export const MOBILE_PRIVACY = {
  title: 'No se expone a internet',
  text: 'Jarvis sigue escuchando solo en tu equipo (127.0.0.1). Tailscale lo publica con HTTPS dentro de tu red privada.',
} as const;

export const MOBILE_NOTICE = {
  title: 'Ten en cuenta',
  items: [
    'El PC tiene que estar encendido y sin suspenderse.',
    'Las acciones sobre el PC (abrir apps, bloquear, documentos…) se ejecutan en el PC, como un control remoto.',
  ],
} as const;
