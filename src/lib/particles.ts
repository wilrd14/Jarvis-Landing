/** Partícula orbital en coordenadas normalizadas (radio 0..1 respecto al radio del canvas). */
export interface Particle {
  /** Ángulo inicial en radianes. */
  angle: number;
  /** Distancia al centro, 0..1. */
  radius: number;
  /** Velocidad angular en rad/s (el signo marca el sentido). */
  speed: number;
  /** Tamaño relativo 0..1 (el script lo traduce a píxeles). */
  size: number;
  /** Índice de color dentro de la paleta del script. */
  color: number;
  /** Fase de la respiración, en radianes. */
  phase: number;
}

/** Superficie en px² que “reserva” cada partícula: define la densidad. */
export const AREA_PER_PARTICLE = 1200;
export const MAX_PARTICLES_DESKTOP = 220;
export const MAX_PARTICLES_MOBILE = 90;
export const MOBILE_BREAKPOINT = 768;

/**
 * Número de partículas proporcional al área del canvas, con tope por tipo de pantalla.
 * @param size lado del canvas cuadrado en px
 * @param viewportWidth ancho del viewport en px (< 768 se considera móvil)
 */
export function particleCount(size: number, viewportWidth: number): number {
  if (!Number.isFinite(size) || size <= 0) return 0;
  const max = viewportWidth < MOBILE_BREAKPOINT ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
  return Math.min(max, Math.round((size * size) / AREA_PER_PARTICLE));
}

/** Generador pseudoaleatorio determinista (mulberry32): misma semilla, misma secuencia. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Crea `count` partículas repartidas en órbitas entre los radios `minRadius` y `maxRadius`.
 * Las interiores giran más rápido, como en una órbita real.
 */
export function createParticles(
  count: number,
  seed: number,
  colorCount: number,
  minRadius = 0.18,
  maxRadius = 0.92,
): Particle[] {
  const random = createRandom(seed);
  const total = Math.max(0, Math.floor(count));
  const colors = Math.max(1, Math.floor(colorCount));
  const particles: Particle[] = [];
  for (let i = 0; i < total; i += 1) {
    const radius = minRadius + random() * (maxRadius - minRadius);
    const direction = random() < 0.7 ? 1 : -1;
    particles.push({
      angle: random() * Math.PI * 2,
      radius,
      speed: (direction * (0.12 + random() * 0.2)) / (0.4 + radius),
      size: random(),
      color: Math.floor(random() * colors),
      phase: random() * Math.PI * 2,
    });
  }
  return particles;
}

/** Posición (x, y) de una partícula en el instante `seconds`, relativa al centro (−1..1). */
export function particlePosition(
  particle: Particle,
  seconds: number,
  breath = 0.04,
): { x: number; y: number } {
  const angle = particle.angle + particle.speed * seconds;
  const radius = particle.radius * (1 + breath * Math.sin(seconds * 0.9 + particle.phase));
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}
