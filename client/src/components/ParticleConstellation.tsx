import { useEffect, useRef, useCallback, useState } from 'react';
import { useInView } from 'framer-motion';
import {
  type Particle,
  type SilhouetteMask,
  spawnParticles,
  updateParticle,
  drawParticle,
} from '@/lib/particles';
import { cn } from '@/lib/utils';

export interface ParticleConstellationProps {
  silhouette: SilhouetteMask;
  particleCount?: number;
  className?: string;
  animate?: boolean;
}

/** Scattered offset data stored per particle for entrance animation */
interface ScatteredPosition {
  offsetX: number;
  offsetY: number;
}

const ENTRANCE_FADE_DURATION = 800; // ms
const ENTRANCE_CONVERGE_DURATION = 1200; // ms
const SCATTER_RANGE = 200; // px offset from base

export function ParticleConstellation({
  silhouette,
  particleCount = 1200,
  className,
  animate = true,
}: ParticleConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entrance animation state
  const scatteredPositionsRef = useRef<ScatteredPosition[]>([]);
  const entranceStartTimeRef = useRef<number | null>(null);
  const entranceCompleteRef = useRef(false);
  const [canvasOpacity, setCanvasOpacity] = useState(0);

  // Framer Motion useInView — triggers once when 20% of component is visible
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  /**
   * Generate random scattered offsets for each particle.
   */
  const generateScatteredPositions = useCallback((count: number) => {
    const scattered: ScatteredPosition[] = [];
    for (let i = 0; i < count; i++) {
      scattered.push({
        offsetX: (Math.random() - 0.5) * 2 * SCATTER_RANGE,
        offsetY: (Math.random() - 0.5) * 2 * SCATTER_RANGE,
      });
    }
    scatteredPositionsRef.current = scattered;
  }, []);

  /**
   * Set up the canvas dimensions accounting for devicePixelRatio.
   * Returns the CSS (logical) width and height.
   */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return { width: 0, height: 0 };

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas internal resolution for retina
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Set CSS display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale the context so drawing operations use logical pixels
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    return { width: rect.width, height: rect.height };
  }, []);

  /**
   * Render a single static frame of particles (used for reduced-motion).
   */
  const renderStaticFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = setupCanvas();
    if (width === 0 || height === 0) return;

    // Spawn particles at their base positions
    particlesRef.current = spawnParticles(silhouette, particleCount, width, height);

    // Clear and draw all particles once
    ctx.clearRect(0, 0, width, height);
    for (const particle of particlesRef.current) {
      drawParticle(ctx, particle);
    }
  }, [silhouette, particleCount, setupCanvas]);

  // Handle entrance fade animation when component enters viewport
  useEffect(() => {
    if (!isInView) return;

    // Start the entrance — fade in over 800ms
    const startTime = performance.now();
    entranceStartTimeRef.current = startTime;

    let fadeFrame: number | null = null;

    const animateFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ENTRANCE_FADE_DURATION, 1);
      setCanvasOpacity(progress);

      if (progress < 1) {
        fadeFrame = requestAnimationFrame(animateFade);
      }
    };

    fadeFrame = requestAnimationFrame(animateFade);

    return () => {
      if (fadeFrame !== null) {
        cancelAnimationFrame(fadeFrame);
      }
    };
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = reducedMotionQuery.matches;

    // Initial setup
    const { width, height } = setupCanvas();
    if (width === 0 || height === 0) return;

    // Spawn particles
    particlesRef.current = spawnParticles(silhouette, particleCount, width, height);

    // Generate scattered positions for entrance
    generateScatteredPositions(particlesRef.current.length);

    // If reduced motion or animate is false, render one static frame and stop
    if (prefersReducedMotion || !animate) {
      setCanvasOpacity(1);
      entranceCompleteRef.current = true;
      ctx.clearRect(0, 0, width, height);
      for (const particle of particlesRef.current) {
        drawParticle(ctx, particle);
      }
      return;
    }

    // Animation loop
    let startTime: number | null = null;

    const loop = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // seconds

      if (!isVisibleRef.current) {
        // Paused — schedule next frame but don't render
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Calculate entrance converge progress
      let convergeProgress = 1;
      if (!entranceCompleteRef.current && entranceStartTimeRef.current !== null) {
        const entranceElapsed = timestamp - entranceStartTimeRef.current;
        convergeProgress = Math.min(entranceElapsed / ENTRANCE_CONVERGE_DURATION, 1);

        // Use ease-out curve for smoother convergence
        convergeProgress = 1 - Math.pow(1 - convergeProgress, 3);

        if (convergeProgress >= 1) {
          entranceCompleteRef.current = true;
        }
      } else if (!entranceCompleteRef.current && entranceStartTimeRef.current === null) {
        // Not yet in view — particles stay scattered
        convergeProgress = 0;
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        const scattered = scatteredPositionsRef.current[i];

        if (!entranceCompleteRef.current && scattered) {
          // During entrance: lerp from scattered position toward base
          const scatteredX = particle.baseX + scattered.offsetX;
          const scatteredY = particle.baseY + scattered.offsetY;

          // Temporarily set particle position for drawing
          const lerpX = scatteredX + (particle.baseX - scatteredX) * convergeProgress;
          const lerpY = scatteredY + (particle.baseY - scatteredY) * convergeProgress;

          // Apply drift on top of lerped position
          const amplitude = particle.size * 1.5 * convergeProgress;
          particle.x = lerpX + Math.sin(elapsed * particle.vx + particle.phase) * amplitude;
          particle.y = lerpY + Math.cos(elapsed * particle.vy + particle.phase) * amplitude;
        } else {
          // Normal floating animation after entrance complete
          updateParticle(particle, elapsed);
        }

        drawParticle(ctx, particle);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    // IntersectionObserver to pause when off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    // ResizeObserver with 150ms debounce
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        const { width: newWidth, height: newHeight } = setupCanvas();
        if (newWidth === 0 || newHeight === 0) return;

        // Re-spawn particles with new dimensions
        particlesRef.current = spawnParticles(silhouette, particleCount, newWidth, newHeight);
        generateScatteredPositions(particlesRef.current.length);
      }, 150);
    });
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [silhouette, particleCount, animate, setupCanvas, renderStaticFrame, generateScatteredPositions]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full relative', className)}
      style={{ opacity: canvasOpacity, transition: 'opacity 0ms' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
