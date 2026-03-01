import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  gradient = false,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-16", className)}>
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
          gradient ? "gradient-text" : "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-foreground-muted text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
