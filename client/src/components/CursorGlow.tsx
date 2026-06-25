import { useEffect, useRef } from "react";

/**
 * Full-page cursor glow that follows the mouse with a soft radial gradient.
 * Purely decorative — hidden from assistive tech.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY + window.scrollY;
    };

    const loop = () => {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      el.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 w-[600px] h-[600px] rounded-full opacity-20 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(128,82,255,0.4) 0%, rgba(128,82,255,0.1) 30%, transparent 70%)",
      }}
    />
  );
}
