import { useMemo } from "react";

type Shape = "triangle" | "diamond" | "square" | "circle";

type Item = {
  x: number;
  y: number;
  size: number;
  rot: number;
  shape: Shape;
  color: string;
  delay: number;
  dur: number;
};

// Deterministic PRNG so SSR + client agree.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHAPES: Shape[] = ["triangle", "diamond", "square", "circle"];
const COLORS = [
  "#8052ff",
  "#ffb829",
  "#15846e",
  "#ffffff",
];

type Props = {
  count?: number;
  seed?: number;
  className?: string;
  /** Carve out a centered region (0-1 of min(w,h)) so background shapes
   *  don't overlap the silhouette constellation. */
  exclusionRadius?: number;
};

export function AmbientShapes({
  count = 38,
  seed = 7,
  className,
  exclusionRadius = 0.32,
}: Props) {
  const items = useMemo<Item[]>(() => {
    const rand = mulberry32(seed);
    const out: Item[] = [];
    let guard = 0;
    while (out.length < count && guard < count * 20) {
      guard++;
      const x = rand();
      const y = rand();
      // skip the center exclusion zone
      const dx = x - 0.5;
      const dy = y - 0.5;
      if (Math.sqrt(dx * dx + dy * dy) < exclusionRadius) continue;
      out.push({
        x,
        y,
        size: 6 + rand() * 18,
        rot: rand() * 360,
        shape: SHAPES[Math.floor(rand() * SHAPES.length)],
        color: COLORS[Math.floor(rand() * COLORS.length)],
        delay: rand() * -10,
        dur: 8 + rand() * 12,
      });
    }
    return out;
  }, [count, seed, exclusionRadius]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute opacity-60 ambient-float"
          style={{
            left: `${it.x * 100}%`,
            top: `${it.y * 100}%`,
            width: it.size,
            height: it.size,
            transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.dur}s`,
          }}
        >
          <Glyph shape={it.shape} color={it.color} />
        </span>
      ))}
    </div>
  );
}

function Glyph({ shape, color }: { shape: Shape; color: string }) {
  const stroke = color;
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
          <path d="M10 2 L18 18 L2 18 Z" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
          <path d="M10 1 L19 10 L10 19 L1 10 Z" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
          <circle cx="10" cy="10" r="8" stroke={stroke} strokeWidth="1" />
        </svg>
      );
  }
}
