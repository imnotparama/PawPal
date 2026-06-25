import { useEffect, useRef, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
}

/**
 * Horizontal scroll with full cinematic panel transitions.
 * Converts vertical scroll → horizontal movement.
 * Each panel's content fades/slides/scales based on scroll proximity.
 *
 * Content elements with [data-reveal] get staggered entrance/exit animations.
 * Elements with [data-reveal-delay="N"] get additional stagger offset.
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

      const bar = container.querySelector<HTMLElement>("[data-progress-bar]");
      if (bar) bar.style.transform = `scaleX(${progress})`;
    };

    const loop = () => {
      if (reduced) {
        currentX = targetX;
      } else {
        currentX += (targetX - currentX) * 0.07;
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;

      const panelElements = track.querySelectorAll<HTMLElement>("[data-h-panel]");
      panelElements.forEach((panel, i) => {
        // -1 = panel fully to the left (gone), 0 = active, 1 = panel to the right (incoming)
        const panelProgress = progressRef.current * (panels - 1) - i;
        const clamped = Math.max(-1.5, Math.min(1.5, panelProgress));

        // — Ambient shapes parallax —
        const shapes = panel.querySelectorAll<HTMLElement>(".ambient-float");
        shapes.forEach((shape) => {
          const speed = parseFloat(shape.dataset.parallax || "0.3");
          const tx = clamped * 140 * speed;
          const ty = clamped * 50 * speed;
          const rot = clamped * 45 * speed;
          const scale = 1 + Math.abs(clamped) * 0.12;
          shape.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
        });

        // — Content reveal animations —
        // proximity: 1 = fully visible, 0 = fully gone
        const proximity = Math.max(0, 1 - Math.abs(clamped));
        // direction: negative = leaving left, positive = entering from right
        const direction = -clamped;

        // Main content wrapper
        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        if (content) {
          if (reduced) {
            content.style.opacity = proximity > 0.3 ? "1" : "0";
            content.style.transform = "none";
          } else {
            const translateX = direction * 80 * (1 - proximity);
            const translateY = (1 - proximity) * 30;
            const scale = 0.92 + proximity * 0.08;
            content.style.opacity = `${Math.pow(proximity, 1.5)}`;
            content.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            content.style.filter = proximity < 0.5 ? `blur(${(1 - proximity * 2) * 4}px)` : "none";
          }
        }

        // Staggered child reveals
        const reveals = panel.querySelectorAll<HTMLElement>("[data-reveal]");
        reveals.forEach((el, idx) => {
          const delay = parseFloat(el.dataset.revealDelay || `${idx * 0.08}`);
          // Offset proximity by delay for stagger effect
          const staggeredProximity = Math.max(0, Math.min(1, proximity * 1.5 - delay));

          if (reduced) {
            el.style.opacity = staggeredProximity > 0.2 ? "1" : "0";
            el.style.transform = "none";
          } else {
            const ty = (1 - staggeredProximity) * 40;
            const tx = direction * 30 * (1 - staggeredProximity);
            el.style.opacity = `${Math.pow(staggeredProximity, 2)}`;
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            el.style.transition = "none";
          }
        });
      });

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
        {/* Progress bar */}
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
