import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-transparent border border-white/10 rounded-3xl p-6 shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}
