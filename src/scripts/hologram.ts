import { createParticles, particleCount, particlePosition, type Particle } from '@/lib/particles';

/*
 * Holograma decorativo. Se conecta al DOM solo con `data-hologram` (canvas) y
 * `data-hologram-fallback` (imagen de respaldo). Los colores reflejan los tokens
 * de global.css (Brief §5); en el canvas no se pueden usar variables CSS.
 */
const COLOR_CORE = '232, 255, 246'; // --color-core
const COLOR_EMERALD = '31, 224, 160'; // --color-emerald
const COLOR_TURQUOISE = '20, 196, 196'; // --color-turquoise
const COLOR_SPARK = '43, 255, 184'; // --color-spark
const PARTICLE_COLORS = [COLOR_EMERALD, COLOR_TURQUOISE, COLOR_CORE];

const MAX_DPR = 2;
const SEED = 20261021;
const TAU = Math.PI * 2;

interface Ring {
  radius: number;
  segments: number;
  gap: number;
  speed: number;
  width: number;
  color: string;
  alpha: number;
}

const RINGS: Ring[] = [
  {
    radius: 0.96,
    segments: 24,
    gap: 0.35,
    speed: 0.05,
    width: 1.5,
    color: COLOR_EMERALD,
    alpha: 0.7,
  },
  {
    radius: 0.74,
    segments: 9,
    gap: 0.5,
    speed: -0.09,
    width: 2,
    color: COLOR_TURQUOISE,
    alpha: 0.6,
  },
  { radius: 0.52, segments: 5, gap: 0.6, speed: 0.14, width: 2.5, color: COLOR_SPARK, alpha: 0.55 },
];
const TICKS = 72;

const rgba = (color: string, alpha: number): string => `rgba(${color}, ${alpha})`;

/** Dibuja anillos segmentados con rotación independiente. */
function drawRings(ctx: CanvasRenderingContext2D, r: number, seconds: number): void {
  for (const ring of RINGS) {
    const step = TAU / ring.segments;
    const arc = step * (1 - ring.gap);
    const offset = seconds * ring.speed * TAU;
    ctx.strokeStyle = rgba(ring.color, ring.alpha);
    ctx.lineWidth = ring.width;
    ctx.beginPath();
    for (let i = 0; i < ring.segments; i += 1) {
      const start = offset + i * step;
      ctx.moveTo(Math.cos(start) * ring.radius * r, Math.sin(start) * ring.radius * r);
      ctx.arc(0, 0, ring.radius * r, start, start + arc);
    }
    ctx.stroke();
  }
}

/** Marcas HUD fijas alrededor del anillo exterior; cada cuarta es más larga. */
function drawTicks(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.strokeStyle = rgba(COLOR_EMERALD, 0.35);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < TICKS; i += 1) {
    const a = (i / TICKS) * TAU;
    const inner = i % 4 === 0 ? 0.9 : 0.93;
    ctx.moveTo(Math.cos(a) * inner * r, Math.sin(a) * inner * r);
    ctx.lineTo(Math.cos(a) * 0.98 * r, Math.sin(a) * 0.98 * r);
  }
  ctx.stroke();
}

/** Núcleo luminoso que respira suavemente. */
function drawCore(ctx: CanvasRenderingContext2D, r: number, seconds: number): void {
  const pulse = 1 + 0.06 * Math.sin(seconds * 1.1);
  const radius = r * 0.3 * pulse;
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, rgba(COLOR_CORE, 0.95));
  gradient.addColorStop(0.35, rgba(COLOR_SPARK, 0.45));
  gradient.addColorStop(1, rgba(COLOR_SPARK, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.fill();
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  r: number,
  seconds: number,
): void {
  for (const particle of particles) {
    const { x, y } = particlePosition(particle, seconds);
    const color = PARTICLE_COLORS[particle.color] ?? COLOR_EMERALD;
    ctx.fillStyle = rgba(color, 0.4 + particle.size * 0.5);
    ctx.beginPath();
    ctx.arc(x * r, y * r, 0.8 + particle.size * 1.6, 0, TAU);
    ctx.fill();
  }
}

/** Inicializa un canvas; si algo falta, deja visible el respaldo estático. */
function initHologram(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const fallback = canvas.parentElement?.querySelector<HTMLElement>('[data-hologram-fallback]');
  const motionQuery =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  let particles: Particle[] = [];
  let size = 0;
  let frame = 0;
  let visible = true;
  let startTime = 0;

  const animate = (): boolean => !(motionQuery?.matches ?? false) && visible && !document.hidden;

  const render = (seconds: number): void => {
    const r = size / 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = canvas.width / size;
    ctx.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);
    drawRings(ctx, r, seconds);
    drawTicks(ctx, r);
    drawParticles(ctx, particles, r, seconds);
    drawCore(ctx, r, seconds);
  };

  const tick = (now: number): void => {
    frame = 0;
    if (!animate()) return;
    render((now - startTime) / 1000);
    frame = requestAnimationFrame(tick);
  };

  /** Arranca o detiene el bucle según el estado; sin movimiento, un solo fotograma. */
  const sync = (): void => {
    if (animate()) {
      if (frame === 0) {
        startTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
      return;
    }
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (size > 0) render(0);
  };

  const resize = (): void => {
    const side = Math.round(canvas.clientWidth);
    if (side <= 0 || side === size) return;
    size = side;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    particles = createParticles(
      particleCount(size, window.innerWidth),
      SEED,
      PARTICLE_COLORS.length,
    );
    sync();
  };

  canvas.hidden = false;
  if (fallback) fallback.hidden = true;
  resize();

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', sync);
  motionQuery?.addEventListener('change', sync);
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-hologram]').forEach(initHologram);
