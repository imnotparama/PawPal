// Particle constellation engine: spawn particles inside an SVG path silhouette,
// then animate gentle sinusoidal drift on a HTML5 canvas. Pure DOM, no deps.

export type Shape = "triangle" | "circle" | "diamond" | "square";
export type Particle = {
  bx: number; // base x (0-1 normalized)
  by: number; // base y (0-1 normalized)
  size: number;
  color: string;
  shape: Shape;
  phase: number; // animation phase
  amp: number; // drift amplitude
  speed: number;
};

const COLORS = ["#8052ff", "#ffb829", "#15846e", "#ffffff", "#ffffff"];
const SHAPES: Shape[] = ["triangle", "circle", "diamond", "square"];

// Build a sampler that returns true if a normalized (0-1) point lies inside
// a given SVG path string at viewBox size [vw, vh].
export function makePathSampler(
  pathD: string,
  vw: number,
  vh: number,
): (x: number, y: number) => boolean {
  if (typeof document === "undefined") return () => true;
  const path = new Path2D(pathD);
  const canvas = document.createElement("canvas");
  canvas.width = vw;
  canvas.height = vh;
  const ctx = canvas.getContext("2d")!;
  return (nx: number, ny: number) => {
    const x = nx * vw;
    const y = ny * vh;
    return ctx.isPointInPath(path, x, y);
  };
}

export function spawnParticles(
  count: number,
  sampler: (x: number, y: number) => boolean,
): Particle[] {
  const out: Particle[] = [];
  let guard = 0;
  while (out.length < count && guard < count * 40) {
    guard++;
    const x = Math.random();
    const y = Math.random();
    if (!sampler(x, y)) continue;
    const r = Math.random();
    // Color mix tuned for a Dala-brain-like richness: amber predominant, then
    // plum, then bone, with occasional lichen.
    const color =
      r < 0.42
        ? "#ffb829"
        : r < 0.72
          ? "#8052ff"
          : r < 0.92
            ? "#ffffff"
            : "#15846e";
    out.push({
      bx: x,
      by: y,
      size: 1.2 + Math.random() * 3.5,
      color,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      phase: Math.random() * Math.PI * 2,
      amp: 0.002 + Math.random() * 0.006,
      speed: 0.4 + Math.random() * 0.8,
    });
  }
  return out;
}

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  x: number,
  y: number,
  alpha: number,
) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  const s = p.size;
  switch (p.shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(x, y, s / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "square":
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(x, y - s / 2);
      ctx.lineTo(x + s / 2, y);
      ctx.lineTo(x, y + s / 2);
      ctx.lineTo(x - s / 2, y);
      ctx.closePath();
      ctx.fill();
      break;
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(x, y - s / 2);
      ctx.lineTo(x + s / 2, y + s / 2);
      ctx.lineTo(x - s / 2, y + s / 2);
      ctx.closePath();
      ctx.fill();
      break;
  }
}
