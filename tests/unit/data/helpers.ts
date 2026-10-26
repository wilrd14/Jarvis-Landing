import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import { ICONS } from '@/components/icons';

/** Devuelve todas las cadenas de un objeto de datos, recursivamente. */
export function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

/** Devuelve todos los valores de claves llamadas `icon`, recursivamente. */
export function collectIcons(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectIcons);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      k === 'icon' && typeof v === 'string' ? [v] : collectIcons(v),
    );
  }
  return [];
}

export const ICON_NAMES = Object.keys(ICONS);

/** Ids de sección reales (id="x" en el elemento <section>) de src/sections. */
export function sectionIds(): string[] {
  const dir = fileURLToPath(new URL('../../../src/sections/', import.meta.url));
  const ids: string[] = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.astro'))) {
    const m = readFileSync(dir + f, 'utf8').match(/<section\s+id="([^"]+)"/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

export const EXPECTED_ANCHORS = [
  'inicio',
  'voz',
  'instantaneas',
  'acciones',
  'documentos',
  'skills',
  'movil',
  'seguridad',
  'costes',
  'instalacion',
  'faq',
  'autor',
  'cta',
];

export function expectNoEmptyStrings(data: unknown) {
  const strings = collectStrings(data);
  expect(strings.length).toBeGreaterThan(0);
  for (const s of strings) expect(s.trim(), 'cadena vacía o solo espacios').not.toBe('');
}
