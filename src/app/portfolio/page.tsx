"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/shared/ScrollReveal";
import GlowEffect from "@/components/ui/GlowEffect";
import { portfolioItems, categories } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTour, setSelectedTour] = useState<PortfolioItem | null>(null);

  const filtered =
    activeFilter === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <GlowEffect color="teal" size="lg" className="top-20 -right-20" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Our <span className="gradient-text">Work</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              Browse our collection of immersive virtual tours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Filter bar */}
          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveFilter(cat.value)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all",
                    activeFilter === cat.value
                      ? "bg-primary text-white"
                      : "bg-white/5 text-foreground-muted hover:bg-white/10 border border-white/10"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="group glass-card overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300"
                    onClick={() => item.tourUrl && setSelectedTour(item)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/80 text-white capitalize">
                          {item.category.replace("-", " ")}
                        </span>
                      </div>
                      {item.tourUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium">
                            View Tour
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-foreground-muted text-sm">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Tour Modal */}
      <AnimatePresence>
        {selectedTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTour(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl glass-card p-2 md:p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute -top-12 right-0 text-white hover:text-foreground-muted transition-colors"
              >
                <X size={28} />
              </button>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={selectedTour.tourUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title={selectedTour.title}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">
                  {selectedTour.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {selectedTour.location}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
