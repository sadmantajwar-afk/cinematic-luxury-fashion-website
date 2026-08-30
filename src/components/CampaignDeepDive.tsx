"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

const CAMPAIGN_SHOTS = [
  {
    src: "/products/corduroy_utility_jacket_01.jpg",
    title: "TACTILE 8-WALE CORDUROY",
  },
  {
    src: "/products/corduroy_utility_jacket_02.jpg",
    title: "MACRO HORN HARDWARE & CUFF RIBS",
  },
  {
    src: "/products/corduroy_utility_jacket_03.jpg",
    title: "DUAL FLAP GUSSET POCKETS",
  },
  {
    src: "/products/greenvel_luxe.jpg",
    title: "EMERALD SUEDE VELVET & GOLD ZARDOSI",
  },
];

export default function CampaignDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);
  
  const detail1Visible = useTransform(scrollYProgress, (v) => v >= 0.10 && v <= 0.42);
  const detail2Visible = useTransform(scrollYProgress, (v) => v >= 0.38 && v <= 0.70);
  const detail3Visible = useTransform(scrollYProgress, (v) => v >= 0.65 && v <= 0.98);

  // Since we cannot use AnimatePresence effectively when visibility is a MotionValue boolean,
  // we can map opacity directly instead of using conditional rendering.
  const d1Opacity = useTransform(scrollYProgress, [0.08, 0.12, 0.40, 0.44], [0, 1, 1, 0]);
  const d1Y = useTransform(scrollYProgress, [0.08, 0.12, 0.40, 0.44], [20, 0, 0, -20]);
  const d1Scale = useTransform(scrollYProgress, [0.08, 0.12, 0.40, 0.44], [0.95, 1, 1, 0.95]);
  const d1Pointer = useTransform(d1Opacity, (v) => v > 0.1 ? "auto" : "none");

  const d2Opacity = useTransform(scrollYProgress, [0.36, 0.40, 0.68, 0.72], [0, 1, 1, 0]);
  const d2Y = useTransform(scrollYProgress, [0.36, 0.40, 0.68, 0.72], [20, 0, 0, -20]);
  const d2Scale = useTransform(scrollYProgress, [0.36, 0.40, 0.68, 0.72], [0.95, 1, 1, 0.95]);
  const d2Pointer = useTransform(d2Opacity, (v) => v > 0.1 ? "auto" : "none");

  const d3Opacity = useTransform(scrollYProgress, [0.63, 0.67, 0.96, 1.00], [0, 1, 1, 0]);
  const d3Y = useTransform(scrollYProgress, [0.63, 0.67, 0.96, 1.00], [20, 0, 0, -20]);
  const d3Scale = useTransform(scrollYProgress, [0.63, 0.67, 0.96, 1.00], [0.95, 1, 1, 0.95]);
  const d3Pointer = useTransform(d3Opacity, (v) => v > 0.1 ? "auto" : "none");

  const progressPercentText = useTransform(scrollYProgress, (v) => `PROGRESS: ${Math.round(v * 100)}%`);

  return (
    <section
      id="campaign-section"
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none bg-black">
        <div className="absolute inset-0 w-full h-full">
          {CAMPAIGN_SHOTS.map((shot, idx) => {
            const start = idx / CAMPAIGN_SHOTS.length;
            const end = (idx + 1) / CAMPAIGN_SHOTS.length;
            const fadeStart = start - (1 / CAMPAIGN_SHOTS.length);
            const fadeEnd = start;

            const opacity = idx === 0 
              ? useTransform(scrollYProgress, [end, end + (1 / CAMPAIGN_SHOTS.length)], [1, 0])
              : useTransform(scrollYProgress, [fadeStart, fadeEnd, end, end + (1 / CAMPAIGN_SHOTS.length)], [0, 1, 1, 0]);

            const zIndex = idx === 0 ? 1 : idx + 1;

            return (
              <motion.div
                key={`campaign-shot-${idx}`}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity,
                  zIndex,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={shot.src}
                  alt={shot.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    scale,
                    willChange: "transform, opacity",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/75 pointer-events-none z-10" />
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

        <div className="absolute top-5 sm:top-6 left-4 sm:left-12 z-20 flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono text-neutral-400">
          <span className="px-2 py-0.5 border border-neutral-700 bg-black/60 text-white font-medium">
            CAMPAIGN 01
          </span>
          <span className="hidden sm:inline">ANATOMICAL STUDY</span>
          <motion.span>{progressPercentText}</motion.span>
        </div>

        <div className="absolute top-5 sm:top-6 right-4 sm:right-12 z-20 flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="hidden sm:inline">INSPECTION ACTIVE</span>
        </div>

        <div className="absolute top-1/4 left-5 sm:left-12 md:left-14 z-20 max-w-xs sm:max-w-sm pointer-events-none">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 mb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-400" />
            <span>CONSTRUCTION STUDY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] uppercase leading-[0.95] text-white">
            ANATOMY OF THE PIECE
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Scroll continuously as we deconstruct the proportions, internal horsehair tailoring, and pure virgin wool gabardine weave.
          </p>
        </div>

        {/* Hotspot 1: High Collar & Shoulder */}
        <motion.div
          className="absolute top-[28%] sm:top-[28%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
          style={{ opacity: d1Opacity, y: d1Y, scale: d1Scale, pointerEvents: d1Pointer as any }}
        >
          <div className="p-4 sm:p-5 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2">
              <span className="text-white font-bold">01 // STRUCTURED COLLAR</span>
              <span>POINT 1A</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-white">
              Floating Horsehair Interlining
            </h4>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed">
              Traditional full-floating canvas gives the collar architectural stiffness without synthetic rigidity. Memory shape that molds to client posture over decades.
            </p>
            <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              SPEC: 100% UNBLEACHED HORSEHAIR • HAND-STITCHED
            </div>
          </div>
        </motion.div>

        {/* Hotspot 2: Wool Gabardine Torso */}
        <motion.div
          className="absolute top-[42%] sm:top-[46%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
          style={{ opacity: d2Opacity, y: d2Y, scale: d2Scale, pointerEvents: d2Pointer as any }}
        >
          <div className="p-4 sm:p-5 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2">
              <span className="text-white font-bold">02 // TEXTURE & DYE</span>
              <span>640 GSM</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-white">
              Ultra-Dense Pure Wool Gabardine
            </h4>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed">
              Engineered with heavy structural drape. The deep obsidian dye absorbs light completely, emphasizing the silhouette&apos;s clean exterior architecture.
            </p>
            <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              TREATMENT: WATER-RESISTANT RAINPROOF FINISH
            </div>
          </div>
        </motion.div>

        {/* Hotspot 3: Sleeves & Raw Hem */}
        <motion.div
          className="absolute top-[56%] sm:top-[60%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
          style={{ opacity: d3Opacity, y: d3Y, scale: d3Scale, pointerEvents: d3Pointer as any }}
        >
          <div className="p-4 sm:p-5 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2">
              <span className="text-white font-bold">03 // ARTICULATED DRAPE</span>
              <span>MOBILITY</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-white">
              Underarm Kinetic Gusset
            </h4>
            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed">
              Hidden interior underarm pattern allows full 180° arm elevation without disturbing the clean drape of the front torso panel.
            </p>
            <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              HARDWARE: HORN BUTTONS HAND-CARVED IN DHAKA, BD
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-5 left-4 sm:left-12 z-20 flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GARMENT DECONSTRUCTION COMPLETE</span>
        </div>
      </div>
    </section>
  );
}
