"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { ArrowDown, CornerRightDown, Sparkles } from "lucide-react";

interface HeroLookFrame {
  id: string;
  title: string;
  subtitle: string;
  collection: string;
  src: string;
  focalY: string;
  lookTag: string;
}

const HERO_LOOKS: HeroLookFrame[] = [
  {
    id: "greenvel-luxe",
    title: "GREENVEL LUXE",
    subtitle: "Emerald green suede velvet jacket with hand-finished gold zardosi embroidery lining the collar.",
    collection: "OVERFLOW OF WARMTH ’25 // LUXURY MINIMALISM",
    src: "/products/greenvel_luxe.jpg",
    focalY: "center 28%",
    lookTag: "LOOK 01 // OVERFLOW OF WARMTH",
  },
  {
    id: "corduroy-utility-full",
    title: "CORDUROY UTILITY",
    subtitle: "Heavyweight 8-wale tactile cotton corduroy jacket engineered with structured drop shoulders and camp spread collar.",
    collection: "AUTUMN / WINTER ’26 ARCHITECTURAL CAPSULE",
    src: "/products/corduroy_utility_jacket_01.jpg",
    focalY: "center 30%",
    lookTag: "LOOK 02 // UTILITY EDIT",
  },
  {
    id: "corduroy-utility-cuff",
    title: "ANATOMY & HARDWARE",
    subtitle: "Macro inspection of the contrast-direction ribbed cuff bands and custom dyed horn buttons crafted in Dhaka.",
    collection: "CRAFT FOCUS // DHAKA ATELIER, BANGLADESH",
    src: "/products/corduroy_utility_jacket_02.jpg",
    focalY: "center 55%",
    lookTag: "DETAIL // MACRO HORN HARDWARE",
  },
  {
    id: "corduroy-utility-pocket",
    title: "TACTILE GEOMETRY",
    subtitle: "Deep dual flap utility cargo pockets with reinforced double-needle basting and clean concealed construction.",
    collection: "PROPORTION STUDY // 8-WALE TEXTURE",
    src: "/products/corduroy_utility_jacket_03.jpg",
    focalY: "center 60%",
    lookTag: "DETAIL // DUAL FLAP CARGO",
  },
  {
    id: "oblique-overcoat",
    title: "OBLIQUE OVERCOAT",
    subtitle: "Architectural double-breasted overcoat cut in 640 GSM pure virgin wool gabardine with exaggerated drop shoulders.",
    collection: "RUNWAY EDIT 01 // OBSIDIAN NOIR",
    src: "https://images.pexels.com/photos/18255304/pexels-photo-18255304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
    focalY: "center 35%",
    lookTag: "LOOK 03 // OBSIDIAN",
  },
];

const HeroShotLayer = ({
  look,
  idx,
  totalShots,
  scrollYProgress,
  scaleTransform,
}: {
  look: HeroLookFrame;
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

  // Manually apply to avoid iOS Safari WAAPI TypeError bugs with motion.div
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
        opacity: opacityValue.get(),
        zIndex,
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={look.src}
        alt={look.title}
        loading={idx <= 1 ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-cover"
        style={{
          objectPosition: look.focalY,
          transform: `scale(${scaleTransform.get()})`,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
};

export default function HeroCanvasSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeLookIndex, setActiveLookIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const segmentIndex = Math.min(
      HERO_LOOKS.length - 1,
      Math.floor(latest * HERO_LOOKS.length)
    );
    if (segmentIndex !== activeLookIndex) {
      setActiveLookIndex(segmentIndex);
    }
  });

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCampaign = () => {
    const el = document.getElementById("campaign-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const currentLook = HERO_LOOKS[activeLookIndex] || HERO_LOOKS[0];
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1.0, 1.08]);
  
  const c1Opacity = useTransform(scrollYProgress, [0.12, 0.24], [1, 0]);
  const c1Y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const c2Opacity = useTransform(scrollYProgress, [0.20, 0.26, 0.54, 0.60], [0, 1, 1, 0]);
  const c2X = useTransform(scrollYProgress, [0.26, 0.60], [8.4, -15.4]);
  
  const c3Opacity = useTransform(scrollYProgress, [0.48, 0.54, 0.78, 0.84], [0, 1, 1, 0]);
  
  const c4Opacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const c4Y = useTransform(scrollYProgress, [0.76, 1], [7.2, 0]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none bg-black">
        <div className="absolute inset-0 w-full h-full">
          {HERO_LOOKS.map((look, idx) => (
            <HeroShotLayer 
              key={`hero-bg-${look.id}`}
              look={look}
              idx={idx}
              totalShots={HERO_LOOKS.length}
              scrollYProgress={scrollYProgress}
              scaleTransform={scaleTransform}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/75 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_20%,_rgba(0,0,0,0.7)_90%] pointer-events-none z-10" />
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

        <div className="absolute top-16 sm:top-20 right-4 sm:right-12 z-20 pointer-events-none flex flex-col items-end text-xs tracking-[0.2em] uppercase font-mono text-neutral-400">
          <span className="text-white font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentLook.lookTag}
          </span>
          <span className="text-neutral-400 mt-0.5 text-[10px] sm:text-[11px]">
            PHASE {String(activeLookIndex + 1).padStart(2, "0")} / {String(HERO_LOOKS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-12 z-20 flex items-center gap-1.5 font-mono text-xs">
          {HERO_LOOKS.map((look, idx) => {
            const isActive = activeLookIndex === idx;
            return (
              <div
                key={`pill-${look.id}`}
                className={`transition-all duration-300 ${
                  isActive
                    ? "w-8 sm:w-10 h-1.5 bg-white"
                    : "w-2.5 sm:w-3 h-1.5 bg-neutral-700 opacity-60"
                }`}
              />
            );
          })}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-12 z-20 pointer-events-none text-xs tracking-[0.2em] uppercase font-mono text-neutral-400 hidden sm:block">
          <div className="text-neutral-400 text-xs">COLLECTION MANIFESTO</div>
          <div className="text-white font-bold text-sm md:text-base mt-0.5">{currentLook.collection}</div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 z-20">
          <motion.div
            className="h-full bg-white"
            style={{ width: progressWidth }}
          />
        </div>

        {/* CHAPTER 1 */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-10 md:p-14 pointer-events-none"
          style={{
            opacity: c1Opacity,
            y: c1Y,
          }}
        >
          <div className="mt-12 sm:mt-14 flex items-center justify-between">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-emerald-950/90 border border-emerald-700 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-emerald-300 font-mono font-bold backdrop-blur-md">
              O/W &rsquo;25 // OVERFLOW OF WARMTH
            </span>
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-300 font-mono hidden md:inline">
              AUTONOMOUS ARCHIVE • DHAKA, BANGLADESH
            </span>
          </div>
          <div className="my-auto flex flex-col items-center text-center px-2">
            <h1 className="text-[24vw] sm:text-[22vw] md:text-[20vw] font-black tracking-[-0.06em] leading-[0.78] text-white select-none drop-shadow-2xl">
              DREV
            </h1>
            <div className="mt-4 sm:mt-6 md:mt-8 flex items-center gap-2 sm:gap-4">
              <span className="w-4 sm:w-16 h-[2px] bg-emerald-400" />
              <p className="text-xs sm:text-base md:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white font-medium max-w-3xl drop-shadow-md">
                EMERALD SUEDE VELVET • GOLD ZARDOSI EMBROIDERY
              </p>
              <span className="w-4 sm:w-16 h-[2px] bg-emerald-400" />
            </div>
          </div>
          <div className="mb-2 sm:mb-4 flex items-end justify-between">
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-300 font-mono">
              <span className="w-6 sm:w-10 h-[1px] bg-neutral-400" />
              <span className="font-medium">SCROLL TO UNROLL THE RUNWAY FILM</span>
            </div>
            <div className="flex flex-col items-center gap-1 animate-bounce text-white">
              <span className="text-[9px] sm:text-[11px] tracking-[0.2em] font-mono uppercase font-bold">SCROLL</span>
              <ArrowDown size={16} />
            </div>
          </div>
        </motion.div>

        {/* CHAPTER 2 */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 md:px-16 pointer-events-none"
          style={{
            opacity: c2Opacity,
          }}
        >
          <motion.div
            className="max-w-4xl"
            style={{ x: c2X }}
          >
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white text-black text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em]">
              <Sparkles size={12} />
              <span>NEW CAPSULE // 8-WALE CORDUROY</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] leading-[0.88] text-white uppercase drop-shadow-xl">
              TACTILE <br />
              UTILITY.
            </h2>
            <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-base md:text-xl text-neutral-100 font-normal max-w-2xl leading-relaxed tracking-wide drop-shadow-md">
              Architectural utility jacket in heavy midnight obsidian corduroy. Engineered with camp collar drape, dual reinforced utility pockets, and custom dyed horn buttons.
            </p>
            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em]">
              <span className="border border-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/75 backdrop-blur-md text-white font-bold">
                WEAVE: 8-WALE TACTILE COTTON
              </span>
              <span className="border border-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/75 backdrop-blur-md text-white font-bold">
                HARDWARE: BESPOKE HORN
              </span>
              <span className="border border-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/75 backdrop-blur-md text-white font-bold">
                LINING: BEMBERG CUPRO
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* CHAPTER 3 */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-center items-end px-5 sm:px-10 md:px-16 pointer-events-none text-right"
          style={{
            opacity: c3Opacity,
          }}
        >
          <div className="max-w-2xl sm:max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1 sm:px-3.5 sm:py-1.5 border-2 border-white bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
              <span>CRAFT & DETAIL INSPECTION</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[0.9] text-white uppercase drop-shadow-xl">
              STRUCTURE <br />
              IN ABSENCE.
            </h2>
            <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-base md:text-lg text-neutral-100 font-normal leading-relaxed max-w-xl ml-auto drop-shadow-md">
              Quiet confidence over statement noise. Every seam is reinforced with double-needle basting; horizontal ribbed cuff bands provide articulated sleeve mobility.
            </p>
            <div className="mt-4 sm:mt-6 md:mt-8 inline-flex flex-col items-end gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-neutral-300">
              <span className="text-white font-bold">SPEC: CONTRAST-DIRECTION CUFF RIBS</span>
              <span>POCKETS: CONCEALED SIDE GUSSETS</span>
              <span>CRAFT: HAND-ASSEMBLED DHAKA ATELIER, BD</span>
            </div>
          </div>
        </motion.div>

        {/* CHAPTER 4 */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-10 md:p-16 pointer-events-auto"
          style={{
            opacity: c4Opacity,
            y: c4Y,
          }}
        >
          <div className="max-w-4xl">
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 mb-2 sm:mb-3 font-bold">
              RUNWAY CAPSULE 01 // DISPATCH READY
            </div>
            <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase text-white leading-none drop-shadow-2xl">
              ENTER THE ARCHIVE.
            </h3>
            <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-neutral-200 max-w-2xl font-normal leading-relaxed drop-shadow-md">
              Explore the permanent collection featuring Greenvel Luxe, Men&rsquo;s Corduroy Utility, and the complete monolithic wardrobe.
            </p>
            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={scrollToProducts}
                className="group relative px-6 py-4 sm:px-8 sm:py-5 bg-white text-black text-xs sm:text-sm font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl active:scale-95"
              >
                <span>EXPLORE ALL OBJECTS</span>
                <CornerRightDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={scrollToCampaign}
                className="px-6 py-4 sm:px-8 sm:py-5 border-2 border-neutral-500 bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] hover:border-white hover:bg-black transition-colors cursor-pointer text-center active:scale-95"
              >
                EXAMINE ATELIER DETAILS
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
