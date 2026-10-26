import { describe, expect, it } from 'vitest';
import {
  MAX_PARTICLES_DESKTOP,
  MAX_PARTICLES_MOBILE,
  createParticles,
  createRandom,
  particleCount,
  particlePosition,
} from '@/lib/particles';

describe('particleCount', () => {
  it('es proporcional al área', () => {
    expect(particleCount(200, 1280)).toBeLessThan(particleCount(300, 1280));
    expect(particleCount(240, 1280)).toBe(48);
  });

  it('respeta los máximos de escritorio y de móvil', () => {
    expect(particleCount(520, 1280)).toBe(MAX_PARTICLES_DESKTOP);
    expect(particleCount(520, 767)).toBe(MAX_PARTICLES_MOBILE);
    expect(particleCount(520, 768)).toBe(MAX_PARTICLES_DESKTOP);
  });

  it('devuelve 0 con tamaños no válidos', () => {
    expect(particleCount(0, 1280)).toBe(0);
    expect(particleCount(-5, 1280)).toBe(0);
    expect(particleCount(Number.NaN, 1280)).toBe(0);
  });
});

describe('createParticles', () => {
  it('es determinista con la misma semilla y distinto con otra', () => {
    expect(createParticles(50, 7, 3)).toEqual(createParticles(50, 7, 3));
    expect(createParticles(50, 7, 3)).not.toEqual(createParticles(50, 8, 3));
  });

  it('genera la cantidad pedida con valores dentro de rango', () => {
    const particles = createParticles(120, 1, 3);
    expect(particles).toHaveLength(120);
    for (const p of particles) {
      expect(p.radius).toBeGreaterThanOrEqual(0.18);
      expect(p.radius).toBeLessThanOrEqual(0.92);
      expect(p.color).toBeGreaterThanOrEqual(0);
      expect(p.color).toBeLessThan(3);
      expect(p.size).toBeGreaterThanOrEqual(0);
      expect(p.size).toBeLessThan(1);
    }
  });

  it('con cantidad 0 o negativa devuelve una lista vacía', () => {
    expect(createParticles(0, 1, 3)).toEqual([]);
    expect(createParticles(-4, 1, 3)).toEqual([]);
  });
});

describe('createRandom', () => {
  it('produce valores en [0, 1)', () => {
    const random = createRandom(42);
    for (let i = 0; i < 200; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('particlePosition', () => {
  it('queda dentro del disco unidad y es determinista', () => {
    const [p] = createParticles(1, 3, 3);
    if (!p) throw new Error('Falta la partícula');
    for (const t of [0, 1.5, 10, 100]) {
      const a = particlePosition(p, t);
      expect(Math.hypot(a.x, a.y)).toBeLessThanOrEqual(1);
      expect(a).toEqual(particlePosition(p, t));
    }
  });

  it('sin respiración conserva el radio al girar', () => {
    const [p] = createParticles(1, 3, 3);
    if (!p) throw new Error('Falta la partícula');
    const { x, y } = particlePosition(p, 5, 0);
    expect(Math.hypot(x, y)).toBeCloseTo(p.radius, 10);
  });
});
