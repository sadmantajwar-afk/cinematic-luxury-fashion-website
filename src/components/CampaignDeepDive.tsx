"use client";

import React, { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
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

const CampaignShotLayer = ({
  shot,
  idx,
  totalShots,
  scrollYProgress,
  scaleTransform,
}: {
  shot: any;
  idx: number;
  totalShots: number;
  scrollYProgress: MotionValue<number>;
  scaleTransform: MotionValue<number>;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const start = idx / totalShots;
  const end = (idx + 1) / totalShots;
  const fadeStart = start - (1 / totalShots);
  const fadeEnd = start;

  const opacityFadeIn = useTransform(scrollYProgress, [fadeStart, fadeEnd, end, end + (1 / totalShots)], [0, 1, 1, 0]);
  const opacityFirst = useTransform(scrollYProgress, [end, end + (1 / totalShots)], [1, 0]);
  
  const opacityValue = idx === 0 ? opacityFirst : opacityFadeIn;
  const zIndex = idx === 0 ? 1 : idx + 1;

  useMotionValueEvent(opacityValue, "change", (latest) => {
    if (containerRef.current) {
      containerRef.current.style.opacity = latest.toString();
    }
  });

  useMotionValueEvent(scaleTransform, "change", (latest) => {
    if (imgRef.current) {
      imgRef.current.style.transform = `scale(${latest})`;
    }
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{
        opacity: idx === 0 ? 1 : 0,
        zIndex,
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={shot.src}
        alt={shot.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
};

export default function CampaignDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);
  
  // Adjusted scroll timings so they strictly do NOT overlap.
  const d1Opacity = useTransform(scrollYProgress, [0.08, 0.12, 0.30, 0.34], [0, 1, 1, 0]);
  const d1Y = useTransform(scrollYProgress,       [0.08, 0.12, 0.30, 0.34], [20, 0, 0, -20]);
  const d1Scale = useTransform(scrollYProgress,   [0.08, 0.12, 0.30, 0.34], [0.95, 1, 1, 0.95]);

  const d2Opacity = useTransform(scrollYProgress, [0.38, 0.42, 0.60, 0.64], [0, 1, 1, 0]);
  const d2Y = useTransform(scrollYProgress,       [0.38, 0.42, 0.60, 0.64], [20, 0, 0, -20]);
  const d2Scale = useTransform(scrollYProgress,   [0.38, 0.42, 0.60, 0.64], [0.95, 1, 1, 0.95]);

  const d3Opacity = useTransform(scrollYProgress, [0.68, 0.72, 0.90, 0.94], [0, 1, 1, 0]);
  const d3Y = useTransform(scrollYProgress,       [0.68, 0.72, 0.90, 0.94], [20, 0, 0, -20]);
  const d3Scale = useTransform(scrollYProgress,   [0.68, 0.72, 0.90, 0.94], [0.95, 1, 1, 0.95]);

  const [progressText, setProgressText] = useState("PROGRESS: 0%");
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgressText(`PROGRESS: ${Math.round(v * 100)}%`));

  const d1Ref = useRef<HTMLDivElement>(null);
  const d2Ref = useRef<HTMLDivElement>(null);
  const d3Ref = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (d1Ref.current) {
      d1Ref.current.style.opacity = d1Opacity.get().toString();
      d1Ref.current.style.transform = `translateY(${d1Y.get()}px) scale(${d1Scale.get()})`;
      d1Ref.current.style.pointerEvents = d1Opacity.get() > 0.1 ? "auto" : "none";
    }
    if (d2Ref.current) {
      d2Ref.current.style.opacity = d2Opacity.get().toString();
      d2Ref.current.style.transform = `translateY(${d2Y.get()}px) scale(${d2Scale.get()})`;
      d2Ref.current.style.pointerEvents = d2Opacity.get() > 0.1 ? "auto" : "none";
    }
    if (d3Ref.current) {
      d3Ref.current.style.opacity = d3Opacity.get().toString();
      d3Ref.current.style.transform = `translateY(${d3Y.get()}px) scale(${d3Scale.get()})`;
      d3Ref.current.style.pointerEvents = d3Opacity.get() > 0.1 ? "auto" : "none";
    }
  });

  return (
    <section
      id="campaign-section"
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none bg-black">
        <div className="absolute inset-0 w-full h-full">
          {CAMPAIGN_SHOTS.map((shot, idx) => (
            <CampaignShotLayer 
              key={`campaign-shot-${idx}`}
              shot={shot}
              idx={idx}
              totalShots={CAMPAIGN_SHOTS.length}
              scrollYProgress={scrollYProgress}
              scaleTransform={scale}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/75 pointer-events-none z-10" />
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

        <div className="absolute top-5 sm:top-6 left-4 sm:left-12 z-20 flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-mono text-neutral-400">
          <span className="px-2 py-0.5 border border-neutral-700 bg-black/60 text-white font-medium">
            CAMPAIGN 01
          </span>
          <span className="hidden sm:inline">ANATOMICAL STUDY</span>
          <span>{progressText}</span>
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
        <div
          ref={d1Ref}
          className="absolute bottom-8 sm:bottom-auto sm:top-[28%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 sm:max-w-sm ml-auto"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <div className="p-5 sm:p-6 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2.5">
              <span className="text-white font-bold">01 // STRUCTURED COLLAR</span>
              <span>POINT 1A</span>
            </div>
            <h4 className="text-sm font-bold tracking-tight uppercase text-white">
              Floating Horsehair Interlining
            </h4>
            <p className="mt-2 text-xs text-neutral-300 font-light leading-relaxed">
              Traditional full-floating canvas gives the collar architectural stiffness without synthetic rigidity. Memory shape that molds to client posture over decades.
            </p>
            <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              SPEC: 100% UNBLEACHED HORSEHAIR • HAND-STITCHED
            </div>
          </div>
        </div>

        {/* Hotspot 2: Wool Gabardine Torso */}
        <div
          ref={d2Ref}
          className="absolute bottom-8 sm:bottom-auto sm:top-[46%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 sm:max-w-sm ml-auto"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <div className="p-5 sm:p-6 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2.5">
              <span className="text-white font-bold">02 // TEXTURE & DYE</span>
              <span>640 GSM</span>
            </div>
            <h4 className="text-sm font-bold tracking-tight uppercase text-white">
              Ultra-Dense Pure Wool Gabardine
            </h4>
            <p className="mt-2 text-xs text-neutral-300 font-light leading-relaxed">
              Engineered with heavy structural drape. The deep obsidian dye absorbs light completely, emphasizing the silhouette&apos;s clean exterior architecture.
            </p>
            <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              TREATMENT: WATER-RESISTANT RAINPROOF FINISH
            </div>
          </div>
        </div>

        {/* Hotspot 3: Sleeves & Raw Hem */}
        <div
          ref={d3Ref}
          className="absolute bottom-8 sm:bottom-auto sm:top-[60%] left-4 right-4 sm:left-auto sm:right-[6%] md:right-[15%] z-20 sm:max-w-sm ml-auto"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <div className="p-5 sm:p-6 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2.5">
              <span className="text-white font-bold">03 // ARTICULATED DRAPE</span>
              <span>MOBILITY</span>
            </div>
            <h4 className="text-sm font-bold tracking-tight uppercase text-white">
              Underarm Kinetic Gusset
            </h4>
            <p className="mt-2 text-xs text-neutral-300 font-light leading-relaxed">
              Hidden interior underarm pattern allows full 180° arm elevation without disturbing the clean drape of the front torso panel.
            </p>
            <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
              HARDWARE: HORN BUTTONS HAND-CARVED IN DHAKA, BD
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 sm:left-12 z-20 flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GARMENT DECONSTRUCTION COMPLETE</span>
        </div>
      </div>
    </section>
  );
}
