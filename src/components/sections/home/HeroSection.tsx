"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import GlowEffect from "@/components/ui/GlowEffect";

const HeroBackground = dynamic(
  () => import("@/components/3d/HeroBackground"),
  { ssr: false }
);

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay slightly so the layout is fully computed before Canvas initializes
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow effects */}
      <GlowEffect color="purple" size="lg" className="top-20 -left-20" />
      <GlowEffect color="blue" size="lg" className="bottom-20 -right-20" />
      <GlowEffect
        color="teal"
        size="md"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* 3D background — sits behind all content */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          mounted ? "opacity-40" : "opacity-0"
        }`}
      >
        <HeroBackground />
      </div>

      {/* Gradient fade at bottom so 3D blends into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-[1]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-foreground-muted mb-8">
            360 Virtual Tours for Real Estate
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
        >
          Step Inside Before
          <br />
          <span className="gradient-text">You Step Foot</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed"
        >
          We create stunning 360 virtual tours that let your buyers explore
          properties from anywhere in the world. Capture attention, close deals
          faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/portfolio"
            className="px-8 py-3.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Explore Our Work
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Get a Free Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
