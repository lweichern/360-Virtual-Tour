import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Cpu, Rocket, Shield, Lightbulb, Heart, Users } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowEffect from "@/components/ui/GlowEffect";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ImmersiveSpace — our story, team, and mission to transform property marketing with 360 virtual tours.",
};

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Capture",
    description:
      "Our team visits your property with professional 360 cameras and drones to capture every angle in stunning detail.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Process",
    description:
      "We stitch, enhance, and build your interactive virtual tour using industry-leading software and techniques.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Deliver",
    description:
      "Receive your finished tour, ready to embed on any website, share via link, or integrate into your listing platform.",
  },
];

const values = [
  { icon: Shield, title: "Quality First", description: "Every tour meets our rigorous quality standards before delivery." },
  { icon: Lightbulb, title: "Innovation", description: "We stay ahead with the latest technology and techniques." },
  { icon: Heart, title: "Client-First", description: "Your success is our success. We go the extra mile, every time." },
  { icon: Users, title: "Reliability", description: "Consistent results, on time, every time. You can count on us." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <GlowEffect color="purple" size="lg" className="top-20 -right-20" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-foreground-muted mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              About <span className="gradient-text">ImmersiveSpace</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              We believe every property deserves to be experienced, not just viewed.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Bridging the Gap Between Physical and Digital
              </h2>
              <p className="mt-6 text-foreground-muted leading-relaxed">
                Founded with a simple belief that technology can transform how
                properties are marketed, ImmersiveSpace started as a small team
                of photographers and developers passionate about creating immersive
                digital experiences.
              </p>
              <p className="mt-4 text-foreground-muted leading-relaxed">
                Today, we serve over 200 clients across Southeast Asia, helping
                property developers and real estate agents showcase their
                properties in ways that were previously impossible. Our team
                combines professional photography expertise with cutting-edge
                virtual tour technology to deliver results that drive real
                business outcomes.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="glass-card p-2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
                  alt="Property photography"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeading
              title="How It Works"
              subtitle="A simple 3-step process from capture to delivery."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center relative">
                  <span className="text-6xl font-bold text-white/5 absolute top-4 right-6">
                    {step.number}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <step.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-foreground-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeading
              title="Meet the Team"
              subtitle="The people behind every immersive experience."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.id} delay={i * 0.1}>
                <div className="glass-card p-6 text-center hover:border-white/20 transition-all duration-300">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                  <p className="mt-3 text-foreground-muted text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <SectionHeading
              title="Our Values"
              subtitle="The principles that guide everything we do."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto">
                    <value.icon size={24} className="text-accent-purple" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-foreground-muted text-sm">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
