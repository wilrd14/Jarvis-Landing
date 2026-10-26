import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToRgb } from '@/lib/contrast';

const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

/** Lee un token `--color-*` desde global.css para probar los valores reales del tema. */
function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}: ?(#[0-9a-fA-F]{6});`));
  if (!match?.[1]) throw new Error(`Falta el token --color-${name}`);
  return match[1];
}

describe('contrastRatio', () => {
  it('da 21:1 entre negro y blanco y 1:1 entre iguales', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 5);
  });

  it('es simétrico y acepta formato corto', () => {
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(contrastRatio('#000', '#fff'), 10);
  });
});

describe('hexToRgb', () => {
  it('convierte colores válidos y rechaza los inválidos', () => {
    expect(hexToRgb('#1fe0a0')).toEqual([31, 224, 160]);
    expect(() => hexToRgb('verde')).toThrow();
  });
});

describe('pares de texto del Brief §5.1', () => {
  const pairs: Array<[string, string]> = [
    ['foreground', 'background'],
    ['muted', 'background'],
    ['emerald', 'background'],
    ['turquoise', 'background'],
    ['danger', 'background'],
    ['background', 'emerald'],
    ['foreground', 'panel'],
    ['muted', 'panel'],
    ['emerald', 'panel'],
    ['foreground', 'panel-raised'],
    ['muted', 'panel-raised'],
    ['emerald', 'panel-raised'],
  ];

  it.each(pairs)('%s sobre %s alcanza 4,5:1', (fg, bg) => {
    expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it('ghost (solo decorativo o texto grande) cumple 3:1 sobre fondo y panel', () => {
    expect(contrastRatio(token('ghost'), token('background'))).toBeGreaterThanOrEqual(4.5);
    // El Brief dice «< 4,5:1 sobre panel»; el cálculo real da ≈ 4,51:1 (margen mínimo).
    expect(contrastRatio(token('ghost'), token('panel'))).toBeGreaterThanOrEqual(3);
  });
});
