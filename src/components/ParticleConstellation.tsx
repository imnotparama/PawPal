import { useEffect, useRef } from "react";
import {
  drawParticle,
  makePathSampler,
  spawnParticles,
  type Particle,
} from "@/lib/particles";

type Props = {
  pathD: string;
  count?: number;
  className?: string;
  ariaLabel?: string;
};

export function ParticleConstellation({
  pathD,
  count = 900,
  className,
  ariaLabel = "Animated particle constellation",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Build silhouette sampler once per pathD.
    const sampler = makePathSampler(pathD, 100, 100);
    particlesRef.current = spawnParticles(count, sampler);

    const resize = () => {
      const el = containerRef.current;
      const canvas = canvasRef.current;
      if (!el || !canvas) return;
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);

    startRef.current = performance.now();

    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { w, h, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const elapsed = (now - startRef.current) / 1000;
      // 1.2s converge entrance: scatter -> base
      const intro = Math.min(elapsed / 1.2, 1);
      const ease = 1 - Math.pow(1 - intro, 3);

      // Fit silhouette square inside container, centered.
      const side = Math.min(w, h);
      const ox = (w - side) / 2;
      const oy = (h - side) / 2;

      for (const p of particlesRef.current) {
        const baseX = ox + p.bx * side;
        const baseY = oy + p.by * side;

        // Scatter offset for entrance: outward from center.
        const cx = ox + side / 2;
        const cy = oy + side / 2;
        const dx = baseX - cx;
        const dy = baseY - cy;
        const scatterX = cx + dx * (1 + (1 - ease) * 1.2);
        const scatterY = cy + dy * (1 + (1 - ease) * 1.2);

        // Sinusoidal drift after entrance.
        const drift = reduced ? 0 : elapsed * p.speed;
        const driftX = Math.cos(drift + p.phase) * p.amp * side;
        const driftY = Math.sin(drift * 0.7 + p.phase) * p.amp * side;

        const x = scatterX * (1 - ease) + (baseX + driftX) * ease;
        const y = scatterY * (1 - ease) + (baseY + driftY) * ease;

        drawParticle(ctx, p, x, y, ease);
      }

      if (!reduced) rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [pathD, count]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
