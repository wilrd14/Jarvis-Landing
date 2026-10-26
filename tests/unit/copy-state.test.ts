import { describe, expect, it } from 'vitest';
import { resolveCopyState } from '@/lib/copy-state';

describe('resolveCopyState', () => {
  it('devuelve copied cuando la escritura funciona', () => {
    expect(resolveCopyState('written')).toBe('copied');
  });

  it('devuelve error si el portapapeles rechaza la escritura', () => {
    expect(resolveCopyState('rejected')).toBe('error');
  });

  it('devuelve error si la API no existe', () => {
    expect(resolveCopyState('unsupported')).toBe('error');
  });
});
