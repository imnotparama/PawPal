import { useEffect, useRef, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
}

/**
 * Full-page snap horizontal scroll.
 * One scroll wheel tick = one panel transition.
 * Fast, smooth, Apple-style page snapping.
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

    // We still need scroll height for the morphing constellation to read
    container.style.height = `${panels * 100}vh`;

    let currentPanel = 0;
    let currentX = 0;
    let targetX = 0;
    let isAnimating = false;
    let wheelCooldown = false;
    let raf: number;

    const TRANSITION_SPEED = reduced ? 1 : 0.12; // lerp factor per frame

    const goToPanel = (index: number) => {
      const clamped = Math.max(0, Math.min(panels - 1, index));
      if (clamped === currentPanel && isAnimating) return;
      currentPanel = clamped;
      isAnimating = true;

      // Update scroll position to match (for constellation morph tracking)
      const maxScroll = container.offsetHeight - window.innerHeight;
      const targetScroll = (currentPanel / (panels - 1)) * maxScroll;
      window.scrollTo({ top: targetScroll, behavior: "instant" as ScrollBehavior });

      targetX = -currentPanel * window.innerWidth;
      progressRef.current = currentPanel / (panels - 1);

      const bar = container.querySelector<HTMLElement>("[data-progress-bar]");
      if (bar) bar.style.transform = `scaleX(${progressRef.current})`;
    };

    // Wheel handler — one tick = one panel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 500); // cooldown between snaps

      if (e.deltaY > 0 || e.deltaX > 0) {
        goToPanel(currentPanel + 1);
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        goToPanel(currentPanel - 1);
      }
    };

    // Touch handling for mobile swipe
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      // Only trigger if horizontal swipe is dominant and > 50px
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) goToPanel(currentPanel + 1);
        else goToPanel(currentPanel - 1);
      }
    };

    // Keyboard support
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToPanel(currentPanel + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPanel(currentPanel - 1);
      }
    };

    const loop = () => {
      // Smooth lerp to target
      const diff = targetX - currentX;
      if (Math.abs(diff) < 0.5) {
        currentX = targetX;
        isAnimating = false;
      } else {
        currentX += diff * TRANSITION_SPEED;
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;

      // Panel content animations
      const panelElements = track.querySelectorAll<HTMLElement>("[data-h-panel]");
      panelElements.forEach((panel, i) => {
        const panelOffset = (currentX / window.innerWidth) + i;
        const clamped = Math.max(-1.5, Math.min(1.5, panelOffset));

        // Ambient shapes parallax
        const shapes = panel.querySelectorAll<HTMLElement>(".ambient-float");
        shapes.forEach((shape) => {
          const speed = parseFloat(shape.dataset.parallax || "0.3");
          const tx = clamped * 140 * speed;
          const ty = clamped * 50 * speed;
          const rot = clamped * 45 * speed;
          const scale = 1 + Math.abs(clamped) * 0.12;
          shape.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
        });

        // Content reveal
        const proximity = Math.max(0, 1 - Math.abs(clamped));
        const direction = -clamped;

        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        if (content) {
          if (reduced) {
            content.style.opacity = proximity > 0.3 ? "1" : "0";
            content.style.transform = "none";
          } else {
            const translateX = direction * 60 * (1 - proximity);
            const translateY = (1 - proximity) * 20;
            const scale = 0.94 + proximity * 0.06;
            content.style.opacity = `${Math.pow(proximity, 1.2)}`;
            content.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            content.style.filter = proximity < 0.4 ? `blur(${(1 - proximity * 2.5) * 3}px)` : "none";
          }
        }

        // Staggered child reveals
        const reveals = panel.querySelectorAll<HTMLElement>("[data-reveal]");
        reveals.forEach((el, idx) => {
          const delay = parseFloat(el.dataset.revealDelay || `${idx * 0.08}`);
          const staggeredProximity = Math.max(0, Math.min(1, proximity * 1.4 - delay));

          if (reduced) {
            el.style.opacity = staggeredProximity > 0.2 ? "1" : "0";
            el.style.transform = "none";
          } else {
            const ty = (1 - staggeredProximity) * 30;
            const tx = direction * 20 * (1 - staggeredProximity);
            el.style.opacity = `${Math.pow(staggeredProximity, 1.8)}`;
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            el.style.transition = "none";
          }
        });
      });

      raf = requestAnimationFrame(loop);
    };

    // Add event listeners
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    // Initial state
    goToPanel(0);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
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
        {/* Progress dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              data-dot={i}
              className="w-2 h-2 rounded-full bg-white/20 transition-all duration-500"
              style={{ transform: "scale(1)" }}
            />
          ))}
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-50">
          <div
            data-progress-bar
            className="h-full bg-plum-voltage origin-left transition-transform duration-500"
            style={{ transform: "scaleX(0)" }}
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
