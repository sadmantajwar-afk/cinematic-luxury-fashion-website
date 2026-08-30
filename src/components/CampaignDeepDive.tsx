"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const CAMPAIGN_SHOTS = [
  "/products/corduroy_utility_jacket_01.jpg",
  "/products/corduroy_utility_jacket_02.jpg",
  "/products/corduroy_utility_jacket_03.jpg",
  "/products/greenvel_luxe.jpg",
];

export default function CampaignDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // 1. Preload campaign imagery asynchronously
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = [];

    CAMPAIGN_SHOTS.forEach((src) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.src = src;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      imgs.push(img);
    });

    imagesRef.current = imgs;

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Viewport visibility observer to save mobile battery and GPU when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Track scroll inside campaign container
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
          targetProgressRef.current = progress;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Smooth 60 FPS Render Loop for Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let active = true;

    const loop = () => {
      if (!active) return;

      if (!isVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const next = current + (target - current) * 0.15;
      currentProgressRef.current = next;

      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      const last = dimensionsRef.current;
      if (
        Math.abs(last.width - w) > 10 ||
        Math.abs(last.height - h) > 80 ||
        last.dpr !== dpr
      ) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        dimensionsRef.current = { width: w, height: h, dpr };
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Multi-shot crossfade
      const totalShots = CAMPAIGN_SHOTS.length - 1;
      const scaled = next * totalShots;
      const fromIdx = Math.min(totalShots, Math.floor(scaled));
      const toIdx = Math.min(totalShots, fromIdx + 1);
      const blend = scaled - fromIdx;

      const drawFrame = (img: HTMLImageElement | undefined, alpha: number) => {
        if (!img || !img.complete || img.naturalWidth === 0 || alpha <= 0.001) return;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const screenRatio = w / h;

        let drawW = w;
        let drawH = h;
        let offX = 0;
        let offY = 0;

        if (screenRatio > imgRatio) {
          drawW = w;
          drawH = w / imgRatio;
          offY = (h - drawH) / 2;
        } else {
          drawH = h;
          drawW = h * imgRatio;
          offX = (w - drawW) / 2;
        }

        const zoom = 1.0 + next * 0.05;
        const zw = drawW * zoom;
        const zh = drawH * zoom;
        const zx = offX - (zw - drawW) / 2;
        const zy = offY - (zh - drawH) / 2;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.drawImage(img, zx, zy, zw, zh);
        ctx.restore();
      };

      const fromImg = imagesRef.current[fromIdx];
      const toImg = imagesRef.current[toIdx];

      if (fromImg) drawFrame(fromImg, 1 - (fromIdx === toIdx ? 0 : blend));
      if (toImg && fromIdx !== toIdx) drawFrame(toImg, blend);

      // Dark editorial monochrome overlay gradient
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(0,0,0,0.88)");
      grad.addColorStop(0.35, "rgba(0,0,0,0.45)");
      grad.addColorStop(0.7, "rgba(0,0,0,0.15)");
      grad.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Progressive detail triggers
  const detail1Visible = scrollProgress >= 0.12 && scrollProgress <= 0.42;
  const detail2Visible = scrollProgress >= 0.38 && scrollProgress <= 0.68;
  const detail3Visible = scrollProgress >= 0.64 && scrollProgress <= 0.95;

  return (
    <section
      id="campaign-section"
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "280vh" }}
    >
      {/* Pinned full-screen container with hardware acceleration */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none gpu-accel">
        {/* Sequence canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover block" />

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
