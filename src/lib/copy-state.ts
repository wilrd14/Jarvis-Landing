/** Estados visibles del botón de copiar. */
export type CopyState = 'idle' | 'copied' | 'error';

/** Resultado de intentar escribir en el portapapeles. */
export type CopyAttempt = 'unsupported' | 'rejected' | 'written';

/**
 * Decide el estado final del botón según el resultado del intento de copiado.
 * Solo `written` cuenta como éxito; la ausencia de API o el rechazo son error.
 */
export function resolveCopyState(attempt: CopyAttempt): CopyState {
  return attempt === 'written' ? 'copied' : 'error';
}
