import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/shared/ScrollReveal";

const stats = [
  { value: 500, suffix: "+", label: "Tours Created" },
  { value: 200, suffix: "+", label: "Satisfied Clients" },
  { value: 50, suffix: "+", label: "Cities Covered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

export default function StatsBar() {
  return (
    <section className="py-16 px-6">
      <ScrollReveal>
        <div className="mx-auto max-w-5xl glass-card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-foreground-muted text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
