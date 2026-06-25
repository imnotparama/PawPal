import { useEffect, useRef } from "react";
import { makePathSampler, drawParticle, type Particle, type Shape } from "@/lib/particles";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

interface MorphParticle extends Particle {
  targets: { bx: number; by: number }[];
  explodeX: number;
  explodeY: number;
  explodeSpeed: number;
}

const SHAPES: Shape[] = ["triangle", "circle", "diamond", "square"];
const PARTICLE_COUNT = 2600;

// Where the constellation sits horizontally per panel
// Hero: right side, Dog: left side, GirlCat: right side, CTA: center
const PANEL_POSITIONS = [0.68, 0.32, 0.68, 0.5];

function spawnMorphParticles(paths: string[]): MorphParticle[] {
  const samplers = paths.map((p) => makePathSampler(p, 100, 100));
  const positionsPerPath: { bx: number; by: number }[][] = paths.map(() => []);

  for (let pathIdx = 0; pathIdx < paths.length; pathIdx++) {
    const sampler = samplers[pathIdx];
    let guard = 0;
    while (positionsPerPath[pathIdx].length < PARTICLE_COUNT && guard < PARTICLE_COUNT * 50) {
      guard++;
      const x = Math.random();
      const y = Math.random();
      if (!sampler(x, y)) continue;
      positionsPerPath[pathIdx].push({ bx: x, by: y });
    }
    while (positionsPerPath[pathIdx].length < PARTICLE_COUNT) {
      positionsPerPath[pathIdx].push({ bx: 0.5, by: 0.5 });
    }
  }

  const particles: MorphParticle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = Math.random();
    const color =
      r < 0.42 ? "#ffb829" : r < 0.72 ? "#8052ff" : r < 0.92 ? "#ffffff" : "#15846e";
    particles.push({
      bx: positionsPerPath[0][i].bx,
      by: positionsPerPath[0][i].by,
      size: 1.2 + Math.random() * 3.5,
      color,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      phase: Math.random() * Math.PI * 2,
      amp: 0.002 + Math.random() * 0.006,
      speed: 0.4 + Math.random() * 0.8,
      targets: paths.map((_, pathIdx) => positionsPerPath[pathIdx][i]),
      explodeX: Math.random(),
      explodeY: Math.random(),
      explodeSpeed: 0.3 + Math.random() * 0.7,
    });
  }
  return particles;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerpPosition(p: MorphParticle, progress: number) {
  const n = p.targets.length; // 3 shapes
  const seg = 1 / (n - 1); // 0.5 each segment
  const idx = Math.min(Math.floor(progress / seg), n - 2);
  const local = (progress - idx * seg) / seg;
  const t = smoothstep(Math.min(Math.max(local, 0), 1));
  const from = p.targets[idx];
  const to = p.targets[idx + 1];
  return {
    bx: from.bx + (to.bx - from.bx) * t,
    by: from.by + (to.by - from.by) * t,
  };
}

function lerpValue(a: number, b: number, t: number) {
  return a + (b - a) * smoothstep(Math.min(Math.max(t, 0), 1));
}

/**
 * Single fixed canvas. Same particles morph between cat → dog → girl+cat.
 * On the 4th panel they explode outward.
 * Position shifts left/right per panel so text and particles don't overlap.
 */
export function MorphingConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<MorphParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    particlesRef.current = spawnMorphParticles([CAT_PATH, DOG_PATH, GIRL_CAT_PATH]);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const maxP = reduced ? 0 : 18;

    const onMouse = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseRef.current.tx = ((e.clientX - r.left) / r.width - 0.5) * maxP;
      mouseRef.current.ty = ((e.clientY - r.top) / r.height - 0.5) * maxP;
    };
    const onLeave = () => { mouseRef.current.tx = 0; mouseRef.current.ty = 0; };

    if (!reduced) {
      window.addEventListener("mousemove", onMouse);
      container.addEventListener("mouseleave", onLeave);
    }

    const resize = () => {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: r.width, h: r.height, dpr };
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    startRef.current = performance.now();

    const NUM_PANELS = 4;
    const EXPLODE_START = 0.74; // last panel transition

    const render = (now: number) => {
      const ctx = canvas.getContext("2d")!;
      const { w, h, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Read scroll progress every frame
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;

      const elapsed = (now - startRef.current) / 1000;
      const intro = Math.min(elapsed / 1.5, 1);
      const ease = 1 - Math.pow(1 - intro, 3);

      // Morph progress: maps scroll (0→1) to shape transitions (0→1 across 3 shapes)
      // First 3 panels do morphing, 4th panel is explosion
      const morphProgress = Math.min(scrollProgress * (NUM_PANELS - 1) / (NUM_PANELS - 2), 1);

      // Explosion factor for 4th panel
      const explodeFactor = scrollProgress > EXPLODE_START
        ? smoothstep(Math.min((scrollProgress - EXPLODE_START) / (1 - EXPLODE_START), 1))
        : 0;

      // X position — lerp between panel positions
      const panelIndex = scrollProgress * (NUM_PANELS - 1);
      const pIdx = Math.min(Math.floor(panelIndex), NUM_PANELS - 2);
      const pLocal = panelIndex - pIdx;
      const xCenter = lerpValue(
        PANEL_POSITIONS[pIdx] ?? 0.5,
        PANEL_POSITIONS[pIdx + 1] ?? 0.5,
        pLocal
      );

      const side = Math.min(w * 0.48, h * 0.72);
      const ox = w * xCenter - side / 2;
      const oy = (h - side) / 2;
      const cx = ox + side / 2;
      const cy = oy + side / 2;

      for (const p of particlesRef.current) {
        const target = lerpPosition(p, morphProgress);
        const baseX = ox + target.bx * side;
        const baseY = oy + target.by * side;

        // Intro scatter from center
        const dx = baseX - cx;
        const dy = baseY - cy;
        const scatterX = cx + dx * (1 + (1 - ease) * 1.4);
        const scatterY = cy + dy * (1 + (1 - ease) * 1.4);

        // Gentle drift
        const drift = reduced ? 0 : elapsed * p.speed;
        const driftX = Math.cos(drift + p.phase) * p.amp * side;
        const driftY = Math.sin(drift * 0.7 + p.phase) * p.amp * side;

        // Final shaped position
        const shapedX = scatterX * (1 - ease) + (baseX + driftX + m.x) * ease;
        const shapedY = scatterY * (1 - ease) + (baseY + driftY + m.y) * ease;

        if (explodeFactor <= 0) {
          drawParticle(ctx, p, shapedX, shapedY, ease * 0.9);
        } else {
          // Explosion: particles fly to random scattered positions
          const freeDriftX = Math.cos(elapsed * p.explodeSpeed * 0.3 + p.phase) * 20;
          const freeDriftY = Math.sin(elapsed * p.explodeSpeed * 0.2 + p.phase * 1.3) * 15;
          const explodedX = p.explodeX * w + freeDriftX + m.x;
          const explodedY = p.explodeY * h + freeDriftY + m.y;

          const finalX = shapedX + (explodedX - shapedX) * explodeFactor;
          const finalY = shapedY + (explodedY - shapedY) * explodeFactor;
          const alpha = ease * (0.9 - explodeFactor * 0.5);
          drawParticle(ctx, p, finalX, finalY, Math.max(alpha, 0.12));
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
