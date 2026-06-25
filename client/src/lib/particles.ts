/**
 * Particle system engine for PawPal AI Landing Page.
 * Spawns, updates, and draws geometric particles constrained within silhouette masks.
 */

// ---------- Interfaces ----------

export interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  shape: 'triangle' | 'circle' | 'diamond';
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  phase: number;
}

export interface SilhouetteMask {
  name: string;
  points: [number, number][];
  width: number;
  height: number;
}

// ---------- Constants ----------

const MAX_PARTICLES = 2000;

const PARTICLE_COLORS = [
  '#15846e', // Lichen (primary)
  '#15846e',
  '#15846e',
  '#8052ff', // Plum Voltage (accent)
  '#ffffff', // White (highlight)
];

const SHAPES: Particle['shape'][] = ['triangle', 'circle', 'diamond'];

// ---------- Core Functions ----------

/**
 * Ray-casting algorithm to determine if a point lies inside a polygon.
 * Casts a ray from (x, y) to the right and counts edge crossings.
 */
export function pointInPolygon(
  x: number,
  y: number,
  polygon: [number, number][]
): boolean {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Spawn particles at random positions within the silhouette mask polygon.
 * Positions are generated randomly and tested against the polygon boundary.
 * Particle count is capped at MAX_PARTICLES (2000).
 */
export function spawnParticles(
  mask: SilhouetteMask,
  count: number,
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  const effectiveCount = Math.min(count, MAX_PARTICLES);
  const particles: Particle[] = [];

  // Compute the bounding box of the polygon in canvas coords for efficient sampling
  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;

  for (const [px, py] of mask.points) {
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }

  // Safety limit to prevent infinite loops if polygon is degenerate
  const maxAttempts = effectiveCount * 20;
  let attempts = 0;

  while (particles.length < effectiveCount && attempts < maxAttempts) {
    attempts++;

    // Random normalized point within the bounding box
    const nx = minX + Math.random() * (maxX - minX);
    const ny = minY + Math.random() * (maxY - minY);

    if (!pointInPolygon(nx, ny, mask.points)) {
      continue;
    }

    // Convert normalized coordinates to canvas coordinates
    const x = nx * canvasWidth;
    const y = ny * canvasHeight;

    const particle: Particle = {
      x,
      y,
      baseX: x,
      baseY: y,
      size: 2 + Math.random() * 4, // 2-6px
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      vx: 0.3 + Math.random() * 0.7, // Drift speed x
      vy: 0.3 + Math.random() * 0.7, // Drift speed y
      opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
      phase: Math.random() * Math.PI * 2, // 0-2π
    };

    particles.push(particle);
  }

  return particles;
}

/**
 * Update a particle's position using sinusoidal drift around its anchor point.
 * Creates a gentle floating/breathing effect.
 */
export function updateParticle(particle: Particle, time: number): void {
  const amplitude = particle.size * 1.5;
  particle.x = particle.baseX + Math.sin(time * particle.vx + particle.phase) * amplitude;
  particle.y = particle.baseY + Math.cos(time * particle.vy + particle.phase) * amplitude;
}

/**
 * Draw a particle on the canvas context based on its shape field.
 * Supports triangle, circle, and diamond shapes.
 */
export function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle
): void {
  ctx.globalAlpha = particle.opacity;
  ctx.fillStyle = particle.color;

  const { x, y, size, shape } = particle;

  switch (shape) {
    case 'circle': {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'triangle': {
      ctx.beginPath();
      // Equilateral triangle centered at (x, y)
      const h = size * Math.sqrt(3);
      ctx.moveTo(x, y - (h * 2) / 3);
      ctx.lineTo(x - size, y + h / 3);
      ctx.lineTo(x + size, y + h / 3);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'diamond': {
      ctx.beginPath();
      // Diamond (square rotated 45°)
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  ctx.globalAlpha = 1;
}
