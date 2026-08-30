"use client";

import React from "react";
import { ArrowDown, CornerRightDown, Sparkles } from "lucide-react";

const HERO_SECTIONS = [
  {
    id: "chapter-1",
    bgSrc: "/products/greenvel_luxe.jpg",
    focalY: "center 28%",
    lookTag: "LOOK 01 // OVERFLOW OF WARMTH",
    collection: "OVERFLOW OF WARMTH ’25 // LUXURY MINIMALISM",
    content: (
      <div className="flex flex-col justify-between h-full p-5 sm:p-10 md:p-14">
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
        <div className="mb-8 flex items-end justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-300 font-mono">
            <span className="w-6 sm:w-10 h-[1px] bg-neutral-400" />
            <span className="font-medium">SCROLL TO UNROLL THE RUNWAY FILM</span>
          </div>
          <div className="flex flex-col items-center gap-1 animate-bounce text-white">
            <span className="text-[9px] sm:text-[11px] tracking-[0.2em] font-mono uppercase font-bold">SCROLL</span>
            <ArrowDown size={16} />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "chapter-2",
    bgSrc: "/products/corduroy_utility_jacket_01.jpg",
    focalY: "center 30%",
    lookTag: "LOOK 02 // UTILITY EDIT",
    collection: "AUTUMN / WINTER ’26 ARCHITECTURAL CAPSULE",
    content: (
      <div className="flex flex-col justify-center h-full px-5 sm:px-10 md:px-16 pb-20">
        <div className="max-w-4xl">
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
        </div>
      </div>
    )
  },
  {
    id: "chapter-3",
    bgSrc: "/products/corduroy_utility_jacket_02.jpg",
    focalY: "center 55%",
    lookTag: "DETAIL // MACRO HORN HARDWARE",
    collection: "CRAFT FOCUS // DHAKA ATELIER, BANGLADESH",
    content: (
      <div className="flex flex-col justify-center items-end h-full px-5 sm:px-10 md:px-16 pb-20 text-right">
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
      </div>
    )
  },
  {
    id: "chapter-4",
    bgSrc: "https://images.pexels.com/photos/18255304/pexels-photo-18255304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
    focalY: "center 35%",
    lookTag: "LOOK 03 // OBSIDIAN",
    collection: "RUNWAY EDIT 01 // OBSIDIAN NOIR",
    content: (
      <div className="flex flex-col justify-end h-full p-5 sm:p-10 md:p-16 pb-24">
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
              onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative px-6 py-4 sm:px-8 sm:py-5 bg-white text-black text-xs sm:text-sm font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl active:scale-95"
            >
              <span>EXPLORE ALL OBJECTS</span>
              <CornerRightDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("campaign-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-4 sm:px-8 sm:py-5 border-2 border-neutral-500 bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em] hover:border-white hover:bg-black transition-colors cursor-pointer text-center active:scale-95"
            >
              EXAMINE ATELIER DETAILS
            </button>
          </div>
        </div>
      </div>
    )
  }
];

export default function HeroCanvasSequence() {
  return (
    <div className="w-full bg-black text-white">
      {HERO_SECTIONS.map((section, idx) => (
        <section 
          key={section.id}
          className="relative w-full h-[100dvh] overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.bgSrc}
              alt={section.lookTag}
              loading={idx === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
              style={{ objectPosition: section.focalY }}
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/75 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_20%,_rgba(0,0,0,0.7)_90%] pointer-events-none z-10" />
          <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

          {/* UI Metadata */}
          <div className="absolute top-16 sm:top-20 right-4 sm:right-12 z-20 pointer-events-none flex flex-col items-end text-xs tracking-[0.2em] uppercase font-mono text-neutral-400">
            <span className="text-white font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {section.lookTag}
            </span>
            <span className="text-neutral-400 mt-0.5 text-[10px] sm:text-[11px]">
              PHASE {String(idx + 1).padStart(2, "0")} / {String(HERO_SECTIONS.length).padStart(2, "0")}
            </span>
          </div>

          <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-12 z-20 flex items-center gap-1.5 font-mono text-xs">
            {HERO_SECTIONS.map((_, dotIdx) => (
              <div
                key={`dot-${dotIdx}`}
                className={`w-2.5 sm:w-3 h-1.5 ${
                  dotIdx === idx ? "bg-white" : "bg-neutral-700 opacity-60"
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-12 z-20 pointer-events-none text-xs tracking-[0.2em] uppercase font-mono text-neutral-400 hidden sm:block">
            <div className="text-neutral-400 text-xs">COLLECTION MANIFESTO</div>
            <div className="text-white font-bold text-sm md:text-base mt-0.5">{section.collection}</div>
          </div>

          {/* Main Content */}
          <div className="relative z-20 w-full h-full">
            {section.content}
          </div>
        </section>
      ))}
    </div>
  );
}
