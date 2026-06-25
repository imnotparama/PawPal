import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  variant: "display" | "headline" | "body" | "eyebrow" | "caption";
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

const variantStyles: Record<TypographyProps["variant"], string> = {
  display:
    "font-acronym text-display leading-display tracking-display text-bone font-extralight",
  headline:
    "font-acronym text-heading-lg leading-heading-lg tracking-heading-lg text-bone font-extralight",
  body: "font-acronym text-subheading leading-subheading tracking-subheading text-ash",
  eyebrow:
    "font-acronym text-caption leading-caption tracking-caption font-medium uppercase text-ash",
  caption: "font-acronym text-body-sm leading-body-sm tracking-body-sm text-smoke",
};

const defaultElements: Record<TypographyProps["variant"], ElementType> = {
  display: "h1",
  headline: "h2",
  body: "p",
  eyebrow: "span",
  caption: "span",
};

export function Typography({
  variant,
  children,
  className,
  as,
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return <Component className={cn(variantStyles[variant], className)}>{children}</Component>;
}
