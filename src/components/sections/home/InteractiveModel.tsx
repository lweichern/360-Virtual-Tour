"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowEffect from "@/components/ui/GlowEffect";

const FloatingHouse = dynamic(() => import("@/components/3d/FloatingHouse"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-foreground-muted text-sm">Loading 3D model...</p>
      </div>
    </div>
  ),
});

export default function InteractiveModel() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <GlowEffect color="blue" size="md" className="-top-10 -right-20" />
      <GlowEffect color="purple" size="sm" className="bottom-10 -left-10" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Bringing Properties to Life"
            subtitle="We transform real estate into immersive digital experiences with cutting-edge 3D technology."
            gradient
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="glass-card p-2 md:p-4 mx-auto max-w-3xl">
            <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <FloatingHouse />
              </Suspense>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
