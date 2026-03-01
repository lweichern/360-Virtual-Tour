import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import GlowEffect from "@/components/ui/GlowEffect";

export default function CTABanner() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <GlowEffect color="blue" size="lg" className="-left-20 top-0" />
      <GlowEffect color="purple" size="lg" className="-right-20 bottom-0" />

      <ScrollReveal>
        <div className="relative z-10 mx-auto max-w-4xl text-center glass-card p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Property Marketing?
          </h2>
          <p className="mt-4 text-foreground-muted text-lg max-w-xl mx-auto">
            Get a custom quote for your next project in minutes. No commitment,
            no hidden fees.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
