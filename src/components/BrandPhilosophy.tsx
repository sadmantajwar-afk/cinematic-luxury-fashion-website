"use client";

import React from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01 // MONOCHROMATIC RESTRAINT",
    title: "Absolute Obsidian",
    desc: "We operate exclusively in monochromatic scales. Pure blacks, chalk ash, and optic white. Without the distraction of decorative hues, form and proportion command total focus.",
  },
  {
    num: "02 // STRUCTURAL DRAPE",
    title: "Low-Tension Weaving",
    desc: "Our 640 GSM virgin wool gabardines and poplins are woven on specialized low-tension artisanal heritage looms in Bangladesh. The fabric possesses an inherent weight that carves deep, statuesque folds during human movement.",
  },
  {
    num: "03 // ATELIER CRAFTSMANSHIP",
    title: "Permanent Objects",
    desc: "Every garment is conceived as a permanent collectible piece, released in strictly numbered editions. Hand-cast horn buttons, unbleached horsehair canvases, and zero disposable materials.",
  },
];

export default function BrandPhilosophy() {
  return (
    <section id="manifesto-section" className="relative w-full bg-black text-white py-24 md:py-36 border-t border-neutral-900 overflow-hidden">
      {/* Background large ghost typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[22vw] font-black tracking-tighter uppercase text-white whitespace-nowrap"
      >
        RESTRAINT
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mb-16 md:mb-24"
        >
          <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-neutral-400 mb-4 flex items-center gap-2.5">
            <span className="w-2 h-2 bg-white" />
            <span>THE DREV MANIFESTO</span>
          </div>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-[-0.04em] text-white leading-[0.88]">
            ARCHITECTURE <br />
            FOR THE BODY.
          </h2>
          <p className="mt-8 text-base sm:text-xl md:text-2xl text-neutral-200 font-normal leading-relaxed">
            DREV was founded on a singular conviction: garment as habitable geometry. By rejecting superficial noise, we reveal the absolute purity of the cut, the weight of the weave, and the quiet authority of the silhouette.
          </p>
        </motion.div>

        {/* 3 Pillars with staggered Framer Motion entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-14 border-t border-neutral-900">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={`pillar-${pillar.num || idx}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -4, borderColor: "#737373" }}
              className="p-8 bg-neutral-950 border border-neutral-800 transition-colors"
            >
              <div className="text-xs sm:text-sm font-mono font-bold text-neutral-400 mb-4">
                {pillar.num}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 p-10 md:p-16 bg-neutral-950 border-2 border-neutral-800 text-center max-w-5xl mx-auto shadow-2xl"
        >
          <blockquote className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-snug">
            &ldquo;WHEN YOU REMOVE EVERYTHING UNNECESSARY, WHAT REMAINS IS NOT EMPTY SPACE — IT IS UNCOMPROMISED FORM.&rdquo;
          </blockquote>
          <div className="mt-6 text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold">
            — DREV DESIGN ATELIER • DHAKA, BANGLADESH
          </div>
        </motion.div>
      </div>
    </section>
  );
}
