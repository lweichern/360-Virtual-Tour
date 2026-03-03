"use client";

import { motion } from "framer-motion";
import GlowEffect from "@/components/ui/GlowEffect";

export default function ShowcaseHero() {
  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden">
      <GlowEffect color="purple" size="lg" className="top-20 -left-20" />
      <GlowEffect color="blue" size="md" className="bottom-10 -right-20" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-foreground-muted mb-8">
            Interactive 3D Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
        >
          3D Virtual
          <br />
          <span className="gradient-text">Walkthrough</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed"
        >
          Explore a condo unit with cinematic 3D transitions. Click any room in
          the dollhouse overview to fly inside and experience the space
          first-hand.
        </motion.p>
      </div>
    </section>
  );
}
