import { Quote } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Trusted by Top Developers & Agents"
            subtitle="See what our clients have to say about working with us."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="glass-card p-8 h-full flex flex-col">
                <Quote size={24} className="text-accent-purple mb-4 shrink-0" />
                <p className="text-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-foreground-muted text-sm">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
