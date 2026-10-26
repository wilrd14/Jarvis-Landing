/**
 * Botón «Copiar» de CodeBlock. Se conecta al DOM con data-codeblock (raíz),
 * data-copy (botón), data-copy-source (texto a copiar), data-copy-label (texto
 * visible del botón) y data-copy-status (región aria-live).
 * Los textos llegan en data-label-copy / data-label-copied / data-label-error del botón.
 * Sin JS el botón permanece oculto y el comando sigue siendo seleccionable.
 */
import { resolveCopyState, type CopyAttempt, type CopyState } from '@/lib/copy-state';

const RESET_DELAY_MS = 2000;

async function writeToClipboard(text: string): Promise<CopyAttempt> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return 'unsupported';
  try {
    await navigator.clipboard.writeText(text);
    return 'written';
  } catch {
    // El rechazo (permisos, contexto inseguro) se traduce en el estado de error visible.
    return 'rejected';
  }
}

/** Deja seleccionado el texto del bloque para copiarlo a mano. */
function selectContents(source: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(source);
  selection.removeAllRanges();
  selection.addRange(range);
}

function initBlock(root: HTMLElement): void {
  const button = root.querySelector<HTMLButtonElement>('[data-copy]');
  const source = root.querySelector<HTMLElement>('[data-copy-source]');
  const label = root.querySelector<HTMLElement>('[data-copy-label]');
  const status = root.querySelector<HTMLElement>('[data-copy-status]');
  if (!button || !source || !label || !status) return;

  const texts: Record<CopyState, string> = {
    idle: button.dataset.labelCopy ?? '',
    copied: button.dataset.labelCopied ?? '',
    error: button.dataset.labelError ?? '',
  };
  let timer: number | undefined;

  const show = (state: CopyState): void => {
    root.dataset.state = state;
    status.dataset.state = state;
    label.textContent = state === 'copied' ? texts.copied : texts.idle;
    status.textContent = state === 'idle' ? '' : texts[state];
  };

  button.addEventListener('click', async () => {
    window.clearTimeout(timer);
    const text = (source.textContent ?? '').trim();
    const state = resolveCopyState(await writeToClipboard(text));
    show(state);
    if (state === 'error') selectContents(source);
    // El error se queda visible hasta el siguiente intento para dar tiempo a leerlo.
    if (state === 'copied') timer = window.setTimeout(() => show('idle'), RESET_DELAY_MS);
  });

  show('idle');
  root.dataset.ready = '';
}

document.querySelectorAll<HTMLElement>('[data-codeblock]').forEach(initBlock);
