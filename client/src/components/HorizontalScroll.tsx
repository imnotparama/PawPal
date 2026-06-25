import { useEffect, useRef, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
}

/**
 * Horizontal scroll container that converts vertical scroll into horizontal movement.
 * Each child is treated as a full-width panel. The container's height is set to
 * (panelCount * 100vh) so the user scrolls vertically, but we translateX the content.
 *
 * Ambient shapes and elements inside get a parallax-like transform based on scroll progress.
 */
export function HorizontalScroll({ children }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const panels = track.children.length;
    // Make the outer container tall enough to scroll through all panels
    container.style.height = `${panels * 100}vh`;

    let currentX = 0;
    let targetX = 0;
    let raf: number;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = container.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      progressRef.current = progress;

      const maxTranslate = (panels - 1) * window.innerWidth;
      targetX = -progress * maxTranslate;

      // Update progress bar
      const bar = container.querySelector<HTMLElement>("[data-progress-bar]");
      if (bar) bar.style.transform = `scaleX(${progress})`;
    };

    const loop = () => {
      if (reduced) {
        currentX = targetX;
      } else {
        // Smooth lerp
        currentX += (targetX - currentX) * 0.08;
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;

      // Apply parallax to ambient shapes within each panel
      const panelElements = track.querySelectorAll<HTMLElement>("[data-h-panel]");
      panelElements.forEach((panel, i) => {
        const panelProgress = progressRef.current * (panels - 1) - i;
        const clampedProgress = Math.max(-1, Math.min(1, panelProgress));

        // Parallax ambient shapes
        const shapes = panel.querySelectorAll<HTMLElement>(".ambient-float");
        shapes.forEach((shape) => {
          const speed = parseFloat(shape.dataset.parallax || "0.3");
          const tx = clampedProgress * 120 * speed;
          const ty = clampedProgress * 40 * speed;
          const rot = clampedProgress * 45 * speed;
          const scale = 1 + Math.abs(clampedProgress) * 0.15;
          shape.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
        });

        // Scale constellation slightly based on scroll proximity
        const constellation = panel.querySelector<HTMLElement>(".dala-constellation-surface");
        if (constellation) {
          const proximity = 1 - Math.abs(clampedProgress);
          const cScale = 0.85 + proximity * 0.15;
          const cOpacity = 0.4 + proximity * 0.6;
          constellation.style.transform = `scale(${cScale})`;
          constellation.style.opacity = `${cOpacity}`;
          constellation.style.transition = "none";
        }
      });

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial position
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ willChange: "transform" }}
        >
          {children}
        </div>
        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-50">
          <div
            data-progress-bar
            className="h-full bg-plum-voltage origin-left"
            style={{ transform: "scaleX(0)", transition: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * A single panel within the horizontal scroll.
 * Takes up exactly 100vw width and 100vh height.
 */
export function HPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-h-panel
      className={`relative w-screen h-screen flex-shrink-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
