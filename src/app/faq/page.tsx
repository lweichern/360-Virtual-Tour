"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/shared/ScrollReveal";
import GlowEffect from "@/components/ui/GlowEffect";
import { faqs } from "@/data/faq";
import { cn } from "@/lib/utils";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={cn(
            "text-foreground-muted shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-foreground-muted leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <GlowEffect color="teal" size="lg" className="top-20 -left-20" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              Everything you need to know about our virtual tour services.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-16 text-center">
            <p className="text-foreground-muted mb-4">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
