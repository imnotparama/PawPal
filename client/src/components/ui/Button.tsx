import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<ButtonProps["variant"], string> = {
  primary:
    "dala-btn-primary bg-plum-voltage text-bone rounded-3xl font-semibold uppercase tracking-[0.05em] text-xs",
  outline:
    "dala-btn-outline-amber border-2 border-amber-spark text-amber-spark rounded-3xl bg-transparent font-semibold uppercase tracking-[0.05em] text-xs",
  ghost:
    "dala-nav-link rounded-3xl bg-transparent font-semibold uppercase tracking-[0.05em] text-xs",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2 text-base",
  lg: "px-8 py-3 text-lg",
};

export function Button({
  variant,
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
