import { Camera, Clock, Globe, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: Camera,
    title: "Immersive 360 Tours",
    description:
      "Give buyers a complete property walkthrough from their phone or desktop.",
    color: "text-accent-blue",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "From shoot to delivery in as little as 48 hours.",
    color: "text-accent-purple",
  },
  {
    icon: Globe,
    title: "Platform Agnostic",
    description:
      "Tours hosted on Matterport, Kuula, or CloudPano — your choice.",
    color: "text-accent-teal",
  },
  {
    icon: TrendingUp,
    title: "Proven ROI",
    description:
      "Properties with virtual tours get 87% more views and sell 31% faster.",
    color: "text-accent-cyan",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-background-secondary">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Why Property Leaders Choose Us"
            subtitle="We combine professional photography with cutting-edge technology to deliver results."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="glass-card p-8 hover:border-white/20 transition-all duration-300">
                <feature.icon size={32} className={feature.color} />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-foreground-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
