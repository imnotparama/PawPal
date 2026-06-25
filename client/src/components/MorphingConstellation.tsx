import { useEffect, useRef } from "react";
import { makePathSampler, drawParticle, type Particle, type Shape } from "@/lib/particles";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

interface MorphParticle extends Particle {
  targets: { bx: number; by: number }[];
}

const SHAPES: Shape[] = ["triangle", "circle", "diamond", "square"];
const PARTICLE_COUNT = 2800;

// Layout: which side particles render on per panel
// 0 = Hero (right), 1 = Dog (left), 2 = GirlCat (right), 3 = CTA (center)
// Values: 0 = left edge, 0.5 = center, 1 = right edge
const PANEL_X_POSITIONS = [0.7, 0.3, 0.7, 0.5];

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
    });
  }
  return particles;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function getTargetPosition(p: MorphParticle, progress: number) {
  const n = p.targets.length;
  const seg = 1 / (n - 1);
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

/**
 * Get the X-center position for the constellation based on scroll progress.
 * Smoothly interpolates between panel positions so particles glide left/right.
 */
function getConstellationXCenter(scrollProgress: number, numPanels: number): number {
  const panelIndex = scrollProgress * (numPanels - 1);
  const idx = Math.min(Math.floor(panelIndex), numPanels - 2);
  const local = panelIndex - idx;
  const t = smoothstep(Math.min(Math.max(local, 0), 1));

  const from = PANEL_X_POSITIONS[idx] ?? 0.5;
  const to = PANEL_X_POSITIONS[idx + 1] ?? 0.5;
  return from + (to - from) * t;
}

export function MorphingConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<MorphParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const scrollRef = useRef(0);
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

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

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

    const render = (now: number) => {
      const ctx = canvas.getContext("2d")!;
      const { w, h, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;

      const elapsed = (now - startRef.current) / 1000;
      const intro = Math.min(elapsed / 1.5, 1);
      const ease = 1 - Math.pow(1 - intro, 3);

      const progress = scrollRef.current;

      // Constellation size: 55% of viewport height, constrained
      const side = Math.min(w * 0.5, h * 0.7);

      // X center slides between left/right based on which panel is active
      const xCenter = getConstellationXCenter(progress, NUM_PANELS);
      const ox = w * xCenter - side / 2;
      const oy = (h - side) / 2;
      const cx = ox + side / 2;
      const cy = oy + side / 2;

      // Morph progress only applies to the 3 shape panels (0..2 out of 4 panels)
      // Map scroll progress to shape morph progress (panels 0-2 do the morphing)
      const morphProgress = Math.min(progress * (NUM_PANELS - 1) / (NUM_PANELS - 2), 1);

      for (const p of particlesRef.current) {
        const target = getTargetPosition(p, morphProgress);
        const baseX = ox + target.bx * side;
        const baseY = oy + target.by * side;

        const dx = baseX - cx;
        const dy = baseY - cy;
        const scatterX = cx + dx * (1 + (1 - ease) * 1.5);
        const scatterY = cy + dy * (1 + (1 - ease) * 1.5);

        const drift = reduced ? 0 : elapsed * p.speed;
        const driftX = Math.cos(drift + p.phase) * p.amp * side;
        const driftY = Math.sin(drift * 0.7 + p.phase) * p.amp * side;

        const x = scatterX * (1 - ease) + (baseX + driftX + m.x) * ease;
        const y = scatterY * (1 - ease) + (baseY + driftY + m.y) * ease;

        drawParticle(ctx, p, x, y, ease * 0.9);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 constellation-glow" />
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
