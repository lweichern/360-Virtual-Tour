import type { Metadata } from "next";
import {
  Camera,
  View,
  Plane,
  LayoutDashboard,
  Video,
  Sofa,
  Check,
} from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowEffect from "@/components/ui/GlowEffect";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our 360 virtual tour services including photography, drone aerial, floor plans, video walkthroughs, and virtual staging.",
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  View,
  Camera,
  Plane,
  LayoutDashboard,
  Video,
  Sofa,
};

const timeline = [
  { day: "Day 1", title: "Consultation & Scheduling", description: "We discuss your needs and book the shoot." },
  { day: "Day 2-3", title: "On-Site Capture", description: "Our photographers visit and capture everything." },
  { day: "Day 4-5", title: "Post-Processing", description: "We build and polish your virtual tour." },
  { day: "Day 6", title: "Review & Revisions", description: "You review and request any changes." },
  { day: "Day 7", title: "Final Delivery", description: "Your tour is ready to share with the world." },
];

const techLogos = [
  "Matterport",
  "Kuula",
  "CloudPano",
  "DJI",
  "Insta360",
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <GlowEffect color="blue" size="lg" className="top-20 -left-20" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              Everything you need to showcase your properties in stunning immersive detail.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || View;
            return (
              <ScrollReveal key={service.id} delay={i * 0.1}>
                <div className="glass-card p-8 h-full hover:border-white/20 transition-all duration-300">
                  <Icon size={32} className="text-primary" />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-foreground-muted leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-foreground-muted"
                      >
                        <Check size={14} className="text-accent-teal shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeading
              title="Powered by Industry-Leading Technology"
              subtitle="We use best-in-class hardware and software to deliver the highest quality results."
            />
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {techLogos.map((logo) => (
                <div
                  key={logo}
                  className="glass-card px-8 py-4 text-lg font-semibold text-foreground-muted"
                >
                  {logo}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <SectionHeading
              title="Project Timeline"
              subtitle="From consultation to delivery in just 7 days."
            />
          </ScrollReveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-10">
              {timeline.map((step, i) => (
                <ScrollReveal key={step.day} delay={i * 0.1}>
                  <div className="relative pl-16 md:pl-20">
                    <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                    <span className="text-primary text-sm font-semibold">
                      {step.day}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-1">
                      {step.title}
                    </h3>
                    <p className="text-foreground-muted text-sm mt-1">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal>
            <div className="mt-16 text-center">
              <Link
                href="/contact"
                className="inline-flex px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                Start Your Project
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
