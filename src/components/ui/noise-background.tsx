import React from "react";
import { cn } from "@/lib/utils";

interface NoiseBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
  gradientColors?: string[];
  noiseOpacity?: number;
  glow?: boolean;
}

export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = ["#8052ff", "#ff6b6b", "#ffb829"],
  noiseOpacity = 0.15,
  glow = true,
  ...props
}: NoiseBackgroundProps) {
  const gradientStyle = {
    "--color-1": gradientColors[0] || "#8052ff",
    "--color-2": gradientColors[1] || "#ff6b6b",
    "--color-3": gradientColors[2] || "#ffb829",
  } as React.CSSProperties;

  return (
    <div
      className={cn("relative overflow-hidden p-[1.5px]", containerClassName)}
      style={gradientStyle}
      {...props}
    >
      {/* Background Gradient Layer with Swirling Animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, var(--color-1), var(--color-2), var(--color-3))",
          backgroundSize: "200% 200%",
          animation: "swirl-glow 6s ease infinite",
          zIndex: 0,
          filter: glow ? "blur(4px)" : "none",
        }}
      />

      {/* SVG Noise Layer Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: noiseOpacity,
          mixBlendMode: "overlay",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Inner Content Wrapper */}
      <div
        className={cn("relative z-10 w-full h-full", className)}
        style={{ borderRadius: "inherit" }}
      >
        {children}
      </div>

      {/* Inject custom CSS keyframes for the swirl animation */}
      <style>{`
        @keyframes swirl-glow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
