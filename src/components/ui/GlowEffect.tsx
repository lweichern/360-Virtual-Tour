import { cn } from "@/lib/utils";

interface GlowEffectProps {
  color?: "blue" | "purple" | "teal";
  size?: "sm" | "md" | "lg";
  position?: string;
  className?: string;
}

const colorMap = {
  blue: "bg-accent-blue",
  purple: "bg-accent-purple",
  teal: "bg-accent-teal",
};

const sizeMap = {
  sm: "w-48 h-48",
  md: "w-72 h-72",
  lg: "w-96 h-96",
};

export default function GlowEffect({
  color = "purple",
  size = "md",
  position,
  className,
}: GlowEffectProps) {
  return (
    <div
      className={cn(
        "glow-orb animate-glow-pulse",
        colorMap[color],
        sizeMap[size],
        position,
        className
      )}
    />
  );
}
