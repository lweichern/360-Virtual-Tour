import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowEffect from "@/components/ui/GlowEffect";
import { pricingTiers } from "@/data/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for 360 virtual tour services. Choose the package that fits your project.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <GlowEffect color="purple" size="lg" className="top-20 left-1/2 -translate-x-1/2" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              Choose the package that fits your project. No hidden fees.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6 relative">
        <GlowEffect color="blue" size="md" className="-left-20 top-1/2" />
        <GlowEffect color="teal" size="md" className="-right-20 top-1/3" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <ScrollReveal key={tier.id} delay={i * 0.1}>
                <div
                  className={cn(
                    "glass-card p-8 h-full flex flex-col relative",
                    tier.highlighted &&
                      "border-primary/50 md:scale-105 md:-my-4"
                  )}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white">
                    {tier.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold gradient-text">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-foreground-muted text-sm ml-1">
                        / project
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-foreground-muted text-sm">
                    {tier.description}
                  </p>

                  <ul className="mt-8 space-y-3 flex-1">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <Check
                          size={16}
                          className="text-accent-teal shrink-0 mt-0.5"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={cn(
                      "mt-8 block text-center px-6 py-3 rounded-full font-medium transition-colors",
                      tier.highlighted
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "border border-white/20 text-white hover:bg-white/5"
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="mt-16 text-center text-foreground-muted max-w-2xl mx-auto">
              Need something bigger? We offer enterprise packages, multi-property
              discounts, and add-on services like virtual staging and video walkthroughs.{" "}
              <Link href="/contact" className="text-primary hover:text-primary-hover underline">
                Contact us
              </Link>{" "}
              for a tailored quote.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
