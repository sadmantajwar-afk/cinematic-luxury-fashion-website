"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const CAMPAIGN_SECTIONS = [
  {
    id: "detail-1",
    bgSrc: "/products/corduroy_utility_jacket_01.jpg",
    title: "STRUCTURED COLLAR",
    subtitle: "POINT 1A",
    heading: "Floating Horsehair Interlining",
    description: "Traditional full-floating canvas gives the collar architectural stiffness without synthetic rigidity. Memory shape that molds to client posture over decades.",
    spec: "SPEC: 100% UNBLEACHED HORSEHAIR • HAND-STITCHED",
  },
  {
    id: "detail-2",
    bgSrc: "/products/corduroy_utility_jacket_02.jpg",
    title: "TEXTURE & DYE",
    subtitle: "640 GSM",
    heading: "Ultra-Dense Pure Wool Gabardine",
    description: "Engineered with heavy structural drape. The deep obsidian dye absorbs light completely, emphasizing the silhouette's clean exterior architecture.",
    spec: "TREATMENT: WATER-RESISTANT RAINPROOF FINISH",
  },
  {
    id: "detail-3",
    bgSrc: "/products/corduroy_utility_jacket_03.jpg",
    title: "ARTICULATED DRAPE",
    subtitle: "MOBILITY",
    heading: "Underarm Kinetic Gusset",
    description: "Hidden interior underarm pattern allows full 180° arm elevation without disturbing the clean drape of the front torso panel.",
    spec: "HARDWARE: HORN BUTTONS HAND-CARVED IN DHAKA, BD",
  }
];

export default function CampaignDeepDive() {
  return (
    <section id="campaign-section" className="w-full bg-black text-white">
      {/* Intro Section */}
      <div className="relative w-full h-[60vh] sm:h-[80vh] flex flex-col justify-center px-5 sm:px-12 md:px-14 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_20%,_rgba(0,0,0,0.7)_90%] pointer-events-none z-10" />
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10 opacity-50" />

        <div className="relative z-20 max-w-xl">
          <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 mb-4 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-400" />
            <span>CONSTRUCTION STUDY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] uppercase leading-[0.95] text-white">
            ANATOMY OF THE PIECE
          </h2>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Deconstructing the proportions, internal horsehair tailoring, and pure virgin wool gabardine weave.
          </p>
        </div>
      </div>

      {/* Anatomy Spotlights */}
      {CAMPAIGN_SECTIONS.map((section, idx) => (
        <div key={section.id} className="relative w-full h-[80vh] sm:h-[100vh] overflow-hidden flex items-end sm:items-center sm:justify-end p-5 sm:p-12 md:p-16 pb-12">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.bgSrc}
              alt={section.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 sm:from-transparent via-black/45 sm:via-black/45 to-black/75 sm:to-black/90 pointer-events-none z-10" />

          {/* Info Card */}
          <div className="relative z-20 w-full sm:max-w-sm">
            <div className="p-5 sm:p-6 bg-black/90 backdrop-blur-md border border-neutral-700 text-white shadow-2xl relative">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 mb-2.5">
                <span className="text-white font-bold">0{idx + 1} // {section.title}</span>
                <span>{section.subtitle}</span>
              </div>
              <h4 className="text-sm font-bold tracking-tight uppercase text-white">
                {section.heading}
              </h4>
              <p className="mt-2 text-xs text-neutral-300 font-light leading-relaxed">
                {section.description}
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-[0.15em] text-neutral-400">
                {section.spec}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
