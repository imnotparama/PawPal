import { useEffect, useRef, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
}

/**
 * Horizontal scroll with page-locked transitions.
 * One scroll gesture = animate to the next/prev panel.
 * During the animation you see the particle morph happening.
 * Always lands on a full panel — never between pages.
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
    console.log("[HorizontalScroll Debug] panels count detected:", panels);

    // Height needed for MorphingConstellation to read scroll progress
    container.style.height = `${panels * 100}vh`;

    let currentPanel = 0;
    let isAnimating = false;
    let wheelAccumulator = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    let raf: number;

    // Smooth animation duration for page transition
    const TRANSITION_DURATION = reduced ? 100 : 800; // ms
    const WHEEL_THRESHOLD = 50; // accumulated delta before triggering

    const animateToPanel = (targetPanel: number) => {
      const clamped = Math.max(0, Math.min(panels - 1, targetPanel));
      if (clamped === currentPanel && !isAnimating) return;
      if (isAnimating) return;

      isAnimating = true;
      const fromPanel = currentPanel;
      currentPanel = clamped;

      const viewportHeight = window.innerHeight;
      const maxScroll = (panels - 1) * viewportHeight;
      const fromScroll = (fromPanel / (panels - 1)) * maxScroll;
      const toScroll = (clamped / (panels - 1)) * maxScroll;
      const distance = toScroll - fromScroll;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / TRANSITION_DURATION, 1);
        // Ease in-out cubic for smooth feel with visible morph
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        window.scrollTo(0, fromScroll + distance * eased);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimating = false;
        }
      };

      requestAnimationFrame(animate);
    };

    // Wheel: accumulate delta, trigger on threshold
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;

      wheelAccumulator += e.deltaY || e.deltaX;

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccumulator = 0; }, 200);

      if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
        if (wheelAccumulator > 0) {
          animateToPanel(currentPanel + 1);
        } else {
          animateToPanel(currentPanel - 1);
        }
        wheelAccumulator = 0;
      }
    };

    // Touch swipe
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 50) {
        animateToPanel(dy > 0 ? currentPanel + 1 : currentPanel - 1);
      }
    };

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        animateToPanel(currentPanel + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        animateToPanel(currentPanel - 1);
      }
    };

    let lastScrollY = -1;
    let scrollChanged = false;
    // Render loop for visual transforms
    const onScroll = () => {
      const viewportHeight = window.innerHeight;
      const maxScroll = (panels - 1) * viewportHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      progressRef.current = progress;
      
      if (window.scrollY !== lastScrollY) {
        scrollChanged = true;
        const maxTranslate = (panels - 1) * window.innerWidth;
        const targetX = -progress * maxTranslate;
        console.log("[HorizontalScroll Debug] " + JSON.stringify({
          scrollY: window.scrollY,
          viewportHeight,
          maxScroll,
          progress,
          targetX,
          panels
        }));
        lastScrollY = window.scrollY;
      } else {
        scrollChanged = false;
      }
    };

    const loop = () => {
      onScroll();

      const progress = progressRef.current;
      const maxTranslate = (panels - 1) * window.innerWidth;
      const targetX = -progress * maxTranslate;

      track.style.transform = `translate3d(${targetX}px, 0, 0)`;

      // Panel content animations
      const panelElements = track.querySelectorAll<HTMLElement>("[data-h-panel]");
      panelElements.forEach((panel, i) => {
        const panelProgress = progress * (panels - 1) - i;
        const clamped = Math.max(-1.5, Math.min(1.5, panelProgress));
        const proximity = Math.max(0, 1 - Math.abs(clamped));

        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        if (scrollChanged) {
          console.log(`[HorizontalScroll Loop] Panel ${i}: progress=${panelProgress.toFixed(3)}, clamped=${clamped.toFixed(3)}, proximity=${proximity.toFixed(3)}, content=${content ? 'yes' : 'no'}`);
        }

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
        const direction = -clamped;

        if (content) {
          if (reduced) {
            content.style.opacity = proximity > 0.3 ? "1" : "0";
            content.style.transform = "none";
          } else {
            // Text fades out quickly and only appears when panel is nearly centered
            // This creates "text out → morph → text in" sequencing
            const textVisibility = proximity > 0.6
              ? Math.pow((proximity - 0.6) / 0.4, 1.5) // only visible above 60% proximity
              : 0;
            const translateX = direction * 60 * (1 - textVisibility);
            const translateY = (1 - textVisibility) * 20;
            const scale = 0.95 + textVisibility * 0.05;
            content.style.opacity = `${textVisibility}`;
            content.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            content.style.filter = textVisibility < 0.3 ? `blur(${(1 - textVisibility * 3.3) * 3}px)` : "none";
          }
        }

        // Staggered child reveals — delayed so they cascade in after panel settles
        const reveals = panel.querySelectorAll<HTMLElement>("[data-reveal]");
        reveals.forEach((el, idx) => {
          const delay = parseFloat(el.dataset.revealDelay || `${idx * 0.1}`);
          // Only starts revealing once panel is 70%+ in view
          const revealBase = proximity > 0.7 ? (proximity - 0.7) / 0.3 : 0;
          const staggeredProximity = Math.max(0, Math.min(1, revealBase * 1.3 - delay));

          if (reduced) {
            el.style.opacity = staggeredProximity > 0.2 ? "1" : "0";
            el.style.transform = "none";
          } else {
            const ty = (1 - staggeredProximity) * 30;
            const tx = direction * 20 * (1 - staggeredProximity);
            el.style.opacity = `${Math.pow(staggeredProximity, 1.5)}`;
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            el.style.transition = "none";
          }
        });
      });

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    // Start at panel 0
    window.scrollTo(0, 0);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ margin: 0, padding: 0 }}>
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
            style={{ transform: "scaleX(0)", transition: "transform 800ms cubic-bezier(0.33, 1, 0.68, 1)" }}
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
