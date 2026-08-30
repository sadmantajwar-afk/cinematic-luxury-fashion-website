"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll inside campaign container
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const containerHeight = containerRef.current.offsetHeight;
          const windowHeight = window.innerHeight;

          const totalScrollable = containerHeight - windowHeight;
          if (totalScrollable <= 0) return;

          const currentScroll = Math.max(0, -rect.top);
          const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Multi-shot crossfade index calculation
  const totalShots = CAMPAIGN_SHOTS.length - 1;
  const scaled = scrollProgress * totalShots;
  const fromIdx = Math.min(totalShots, Math.floor(scaled));
  const toIdx = Math.min(totalShots, fromIdx + 1);
  const blend = scaled - fromIdx;

  // Progressive detail triggers
  const detail1Visible = scrollProgress >= 0.10 && scrollProgress <= 0.42;
  const detail2Visible = scrollProgress >= 0.38 && scrollProgress <= 0.70;
  const detail3Visible = scrollProgress >= 0.65 && scrollProgress <= 0.98;

  return (
    <section
      id="campaign-section"
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "260vh" }}
    >
      {/* Pinned full-screen container with hardware acceleration */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none bg-black">
        {/* Layered Hardware-Accelerated Campaign Image Shots */}
        <div className="absolute inset-0 w-full h-full">
          {CAMPAIGN_SHOTS.map((shot, idx) => {
            let opacity = 0;
            if (idx === fromIdx) {
              opacity = 1 - (fromIdx === toIdx ? 0 : blend);
            } else if (idx === toIdx) {
              opacity = blend;
            }

            const scale = 1.0 + (scrollProgress * 0.06);

            return (
              <div
                key={`campaign-shot-${idx}`}
                className="absolute inset-0 w-full h-full transition-opacity duration-150 ease-out"
                style={{
                  opacity: opacity,
                  zIndex: idx === fromIdx ? 1 : idx === toIdx ? 2 : 0,
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${scale})`,
                    willChange: "transform, opacity",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Dark Editorial Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/75 pointer-events-none z-10" />

        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

        {/* Top HUD */}
        <div className="absolute top-5 sm:top-6 left-4 sm:left-12 z-20 flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono text-neutral-400">
          <span className="px-2 py-0.5 border border-neutral-700 bg-black/60 text-white font-medium">
            CAMPAIGN 01
          </span>
          <span className="hidden sm:inline">ANATOMICAL STUDY</span>
          <span>PROGRESS: {Math.round(scrollProgress * 100)}%</span>
        </div>

        {/* Top-Right Badge */}
        <div className="absolute top-5 sm:top-6 right-4 sm:right-12 z-20 flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="hidden sm:inline">INSPECTION ACTIVE</span>
        </div>

        {/* Left Side Static Title Overlay */}
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

        {/* Progressive Garment Hotspots & Detail Cards */}
        <AnimatePresence>
          {/* Hotspot 1: High Collar & Shoulder */}
          {detail1Visible && (
            <motion.div
              key="deepdive-hotspot-collar"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[28%] sm:top-[28%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
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
          )}

          {/* Hotspot 2: Wool Gabardine Torso */}
          {detail2Visible && (
            <motion.div
              key="deepdive-hotspot-torso"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[42%] sm:top-[46%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
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
          )}

          {/* Hotspot 3: Sleeves & Raw Hem */}
          {detail3Visible && (
            <motion.div
              key="deepdive-hotspot-sleeves"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[56%] sm:top-[60%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 max-w-sm ml-auto"
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
          )}
        </AnimatePresence>

        {/* Scroll cue bottom bar */}
        <div className="absolute bottom-5 left-4 sm:left-12 z-20 flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GARMENT DECONSTRUCTION COMPLETE</span>
        </div>
      </div>
    </section>
  );
}
