/**
 * Sección Seguridad (#seguridad).
 * Fuente: README de Jarvis, apartado «Seguridad»; Brief UX/UI §12.9; PRD RF-08.
 * Cada tarjeta lleva una frase clara y, debajo, la frase técnica del README.
 */
import type { IconName } from '@/components/icons';

export interface SecurityItem {
  icon: IconName;
  title: string;
  /** Explicación en lenguaje comprensible. */
  text: string;
  /** Frase técnica secundaria (se muestra en mono). */
  technical: string;
}

export const SECURITY_HEADING = {
  eyebrow: 'Seguridad',
  title: 'Pensado para que tu equipo siga siendo tuyo',
  intro:
    'Jarvis puede actuar sobre tu PC, así que cada paso está acotado. Estas son las garantías que describe el proyecto, con el término técnico debajo de cada una.',
} as const;

export const SECURITY_ITEMS: readonly SecurityItem[] = [
  {
    icon: 'server',
    title: 'Solo escucha dentro de tu equipo',
    text: 'El servidor de Jarvis no se abre a tu red: solo responde a tu propio PC.',
    technical: 'Servidor solo en loopback.',
  },
  {
    icon: 'shield',
    title: 'Frena las órdenes que llegan desde otras webs',
    text: 'Cada petición se comprueba para frenar que una página externa intente manejar Jarvis en tu nombre.',
    technical:
      'Se validan Host, origen (Sec-Fetch-Site/Origin) y tipo de contenido: frena CSRF y DNS rebinding.',
  },
  {
    icon: 'check',
    title: 'Solo hace lo que está permitido, y con tu visto bueno',
    text: 'Jarvis solo puede ejecutar acciones de una lista cerrada. Las que tienen efecto piden confirmación, y lo que llega de fuera, como el portapapeles, nunca ejecuta nada por sí solo.',
    technical: 'Lista cerrada con validación estricta; confirmación y firma HMAC del cerebro.',
  },
  {
    icon: 'key',
    title: 'Tus claves no salen del servidor',
    text: 'Las API keys no se escriben en los registros ni en el repositorio, y los procesos que Jarvis lanza no las heredan.',
    technical:
      'API keys solo en servidor, fuera de logs y del repositorio; sin herencia a procesos hijos.',
  },
  {
    icon: 'lock',
    title: 'Acceso remoto protegido con PIN',
    text: 'Desde el celular solo se entra con tu PIN. Tras 5 intentos fallidos se bloquea, y los Ajustes y el PIN solo se cambian desde el propio PC.',
    technical:
      'Solo hosts .ts.net configurados; PIN con scrypt; cookie firmada HttpOnly, Secure y SameSite=Strict.',
  },
  {
    icon: 'folder',
    title: 'Tus documentos, en un solo lugar',
    text: 'Jarvis escribe los documentos únicamente en una carpeta propia y nunca sobrescribe lo que ya existe.',
    technical: 'Escritura solo en Documentos\\Jarvis y sin sobrescribir.',
  },
];
