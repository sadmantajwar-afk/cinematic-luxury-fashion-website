"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, CornerRightDown, Sparkles } from "lucide-react";
import { useShop } from "@/context/ShopContext";

interface HeroLookFrame {
  id: string;
  title: string;
  subtitle: string;
  collection: string;
  src: string;
  focalY: number; // 0.0 (top) to 1.0 (bottom)
  zoomRange: [number, number]; // [minZoom, maxZoom]
  accentColor: string;
  lookTag: string;
}

// 5 Key Runway Looks for continuous cross-fading scroll engine
const HERO_LOOKS: HeroLookFrame[] = [
  {
    id: "greenvel-luxe",
    title: "GREENVEL LUXE",
    subtitle: "Emerald green suede velvet jacket with hand-finished gold zardosi embroidery lining the collar.",
    collection: "OVERFLOW OF WARMTH ’25 // LUXURY MINIMALISM",
    src: "/products/greenvel_luxe.jpg",
    focalY: 0.28,
    zoomRange: [1.0, 1.12],
    accentColor: "#16382c",
    lookTag: "LOOK 01 // OVERFLOW OF WARMTH",
  },
  {
    id: "corduroy-utility-full",
    title: "CORDUROY UTILITY",
    subtitle: "Heavyweight 8-wale tactile cotton corduroy jacket engineered with structured drop shoulders and camp spread collar.",
    collection: "AUTUMN / WINTER ’26 ARCHITECTURAL CAPSULE",
    src: "/products/corduroy_utility_jacket_01.jpg",
    focalY: 0.30,
    zoomRange: [1.0, 1.10],
    accentColor: "#1d2d44",
    lookTag: "LOOK 02 // UTILITY EDIT",
  },
  {
    id: "corduroy-utility-cuff",
    title: "ANATOMY & HARDWARE",
    subtitle: "Macro inspection of the contrast-direction ribbed cuff bands and custom dyed horn buttons crafted in Dhaka.",
    collection: "CRAFT FOCUS // DHAKA ATELIER, BANGLADESH",
    src: "/products/corduroy_utility_jacket_02.jpg",
    focalY: 0.55,
    zoomRange: [1.02, 1.14],
    accentColor: "#0d1b2a",
    lookTag: "DETAIL // MACRO HORN HARDWARE",
  },
  {
    id: "corduroy-utility-pocket",
    title: "TACTILE GEOMETRY",
    subtitle: "Deep dual flap utility cargo pockets with reinforced double-needle basting and clean concealed construction.",
    collection: "PROPORTION STUDY // 8-WALE TEXTURE",
    src: "/products/corduroy_utility_jacket_03.jpg",
    focalY: 0.60,
    zoomRange: [1.0, 1.12],
    accentColor: "#1b263b",
    lookTag: "DETAIL // DUAL FLAP CARGO",
  },
  {
    id: "oblique-overcoat",
    title: "OBLIQUE OVERCOAT",
    subtitle: "Architectural double-breasted overcoat cut in 640 GSM pure virgin wool gabardine with exaggerated drop shoulders.",
    collection: "RUNWAY EDIT 01 // OBSIDIAN NOIR",
    src: "https://images.pexels.com/photos/18255304/pexels-photo-18255304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
    focalY: 0.35,
    zoomRange: [1.0, 1.09],
    accentColor: "#212529",
    lookTag: "LOOK 03 // OBSIDIAN",
  },
];

export default function HeroCanvasSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isHeroVisibleRef = useRef(true);

  // Cached dimensions to prevent canvas rebuild on mobile address bar scroll
  const canvasDimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // 1. Preload real high-fashion imagery with async decode
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    HERO_LOOKS.forEach((look, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";

      img.onload = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count >= 2) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count >= 1) setIsReady(true);
      };

      img.src = look.src;
      loadedImages[idx] = img;

      // Asynchronous decode for zero main-thread hitching
      if (typeof img.decode === "function") {
        img.decode().catch(() => {
          // ignore decode rejection
        });
      }
    });

    imagesRef.current = loadedImages;

    const timeout = setTimeout(() => {
      if (isMounted) setIsReady(true);
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // 2. Viewport visibility observer to halt canvas loop when off-screen on phones
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Passive scroll listener with smooth progress calculation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
          if (totalScrollable <= 0) return;

          const currentScroll = Math.max(0, -rect.top);
          const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));

          targetProgressRef.current = rawProgress;
          setScrollProgress(rawProgress);

          const segmentIndex = Math.min(
            HERO_LOOKS.length - 1,
            Math.floor(rawProgress * HERO_LOOKS.length)
          );
          setActiveLookIndex(segmentIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. 60 FPS Mobile-Optimized Render Loop with dampened lerp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      // If off-screen, skip render work to save phone battery & GPU
      if (!isHeroVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Smooth progress lerp
      const target = targetProgressRef.current;
      const current = scrollProgressRef.current;
      const lerpSpeed = 0.14;
      const nextProgress = current + (target - current) * lerpSpeed;
      scrollProgressRef.current = nextProgress;

      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Only resize canvas if dimensions change significantly (avoids mobile address bar bounce)
      const last = canvasDimensionsRef.current;
      if (
        Math.abs(last.width - width) > 10 ||
        Math.abs(last.height - height) > 80 ||
        last.dpr !== dpr
      ) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvasDimensionsRef.current = { width, height, dpr };
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Multi-image continuous scroll crossfade calculations
      const totalSegments = HERO_LOOKS.length - 1;
      const scaledProgress = nextProgress * totalSegments;
      const fromIndex = Math.min(totalSegments, Math.floor(scaledProgress));
      const toIndex = Math.min(totalSegments, fromIndex + 1);
      const blend = scaledProgress - fromIndex; // 0.0 to 1.0

      const drawLookImage = (
        img: HTMLImageElement | undefined,
        look: HeroLookFrame,
        alpha: number,
        localProgress: number
      ) => {
        if (!img || !img.complete || img.naturalWidth === 0 || alpha <= 0.001) return;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const screenRatio = width / height;

        let drawW = width;
        let drawH = height;
        let offsetX = 0;
        let offsetY = 0;

        if (screenRatio > imgRatio) {
          drawW = width;
          drawH = width / imgRatio;
          offsetY = (height - drawH) * look.focalY;
        } else {
          drawH = height;
          drawW = height * imgRatio;
          offsetX = (width - drawW) / 2;
        }

        // Camera push-in along the scroll
        const [minZoom, maxZoom] = look.zoomRange;
        const zoom = minZoom + (maxZoom - minZoom) * localProgress;
        const zoomedW = drawW * zoom;
        const zoomedH = drawH * zoom;
        const zoomedX = offsetX - (zoomedW - drawW) / 2;
        const zoomedY = offsetY - (zoomedH - drawH) * look.focalY;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.drawImage(img, zoomedX, zoomedY, zoomedW, zoomedH);
        ctx.restore();
      };

      const fromImg = imagesRef.current[fromIndex];
      const toImg = imagesRef.current[toIndex];
      const fromLook = HERO_LOOKS[fromIndex];
      const toLook = HERO_LOOKS[toIndex];

      // Draw base image
      if (fromImg && fromLook) {
        drawLookImage(fromImg, fromLook, 1 - (fromIndex === toIndex ? 0 : blend), blend);
      }

      // Draw incoming crossfade image
      if (toImg && toLook && fromIndex !== toIndex) {
        drawLookImage(toImg, toLook, blend, blend);
      }

      // High-Fashion Atmospheric Vignette & Contrast Overlay
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.25,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.78
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.05)");
      gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.40)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.85)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Top & Bottom Atmospheric Gradients
      const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
      topGrad.addColorStop(0, "rgba(0, 0, 0, 0.9)");
      topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, 160);

      const bottomGrad = ctx.createLinearGradient(0, height - 180, 0, height);
      bottomGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomGrad.addColorStop(1, "rgba(0, 0, 0, 0.95)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height - 180, width, 180);

      ctx.restore();

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCampaign = () => {
    const el = document.getElementById("campaign-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Phase Opacity Calculations across 4 storytelling chapters
  const c1Opacity = Math.max(0, Math.min(1, (0.24 - scrollProgress) / 0.12));
  const c1Y = -scrollProgress * 50;

  const c2Start = 0.26;
  const c2End = 0.54;
  const c2Opacity =
    scrollProgress < c2Start
      ? Math.max(0, (scrollProgress - 0.20) / (c2Start - 0.20))
      : scrollProgress > c2End
      ? Math.max(0, (0.60 - scrollProgress) / (0.60 - c2End))
      : 1;
  const c2X = (scrollProgress - 0.38) * -70;

  const c3Start = 0.54;
  const c3End = 0.78;
  const c3Opacity =
    scrollProgress < c3Start
      ? Math.max(0, (scrollProgress - 0.48) / (c3Start - 0.48))
      : scrollProgress > c3End
      ? Math.max(0, (0.84 - scrollProgress) / (0.84 - c3End))
      : 1;

  const c4Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.76) / 0.14));
  const c4Y = Math.max(0, (1 - scrollProgress) * 30);

  const currentLook = HERO_LOOKS[activeLookIndex] || HERO_LOOKS[0];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{ height: "420vh" }}
    >
      {/* Sticky full-screen stage with hardware acceleration */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none gpu-accel">
        {/* Cinematic WebGL / Canvas Sequence Engine */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block"
        />

        {/* Subtle high-fashion film grain */}
        <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

        {/* Loading Indicator */}
        {!isReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/95 text-white p-6">
            <div className="text-3xl sm:text-4xl font-black tracking-[-0.05em] mb-4">DREV</div>
            <div className="w-48 sm:w-52 h-0.5 bg-neutral-800 relative overflow-hidden mb-3">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${Math.round((loadedCount / HERO_LOOKS.length) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
              INITIALIZING ARCHIVE • {Math.round((loadedCount / HERO_LOOKS.length) * 100)}%
            </div>
          </div>
        )}

        {/* Micro-HUD top-right live sequence ticker */}
        <div className="absolute top-16 sm:top-20 right-4 sm:right-12 z-20 pointer-events-none flex flex-col items-end text-xs tracking-[0.2em] uppercase font-mono text-neutral-400">
          <span className="text-white font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentLook.lookTag}
          </span>
          <span className="text-neutral-400 mt-0.5 text-[10px] sm:text-[11px]">
            PHASE {String(activeLookIndex + 1).padStart(2, "0")} / {String(HERO_LOOKS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Interactive Look Pill Indicators (Bottom-Right) */}
        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-12 z-20 flex items-center gap-1.5 font-mono text-xs">
          {HERO_LOOKS.map((look, idx) => {
            const isActive = activeLookIndex === idx;
            return (
              <div
                key={look.id}
                className={`transition-all duration-300 ${
                  isActive
                    ? "w-8 sm:w-10 h-1.5 bg-white"
                    : "w-2.5 sm:w-3 h-1.5 bg-neutral-700 opacity-60"
                }`}
              />
            );
          })}
        </div>

        {/* Micro-HUD bottom-left specs */}
        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-12 z-20 pointer-events-none text-xs tracking-[0.2em] uppercase font-mono text-neutral-400 hidden sm:block">
          <div className="text-neutral-400 text-xs">COLLECTION MANIFESTO</div>
          <div className="text-white font-bold text-sm md:text-base mt-0.5">{currentLook.collection}</div>
        </div>

        {/* Scroll Progress Bar at the absolute bottom edge */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 z-20">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 1: DREV // GREENVEL LUXE OVERFLOW OF WARMTH '25 (0.00 - 0.26)     */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-10 md:p-14 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: c1Opacity,
            transform: `translateY(${c1Y}px)`,
            visibility: c1Opacity > 0.01 ? "visible" : "hidden",
          }}
        >
          {/* Top Tagline */}
          <div className="mt-12 sm:mt-14 flex items-center justify-between">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-emerald-950/90 border border-emerald-700 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-emerald-300 font-mono font-bold backdrop-blur-md">
              O/W &rsquo;25 // OVERFLOW OF WARMTH
            </span>
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-300 font-mono hidden md:inline">
              AUTONOMOUS ARCHIVE • DHAKA, BANGLADESH
            </span>
          </div>

          {/* Large Hero Monolith Typography */}
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

          {/* Bottom Scroll Cue */}
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
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 2: MEN'S CORDUROY UTILITY // TACTILE RESTRAINT (0.26 - 0.54)     */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 md:px-16 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: c2Opacity,
            visibility: c2Opacity > 0.01 ? "visible" : "hidden",
          }}
        >
          <div
            className="max-w-4xl"
            style={{ transform: `translateX(${c2X}px)` }}
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
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 3: ANATOMY & HARDWARE PRECISION (0.54 - 0.78)                     */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-center items-end px-5 sm:px-10 md:px-16 pointer-events-none transition-opacity duration-300 text-right"
          style={{
            opacity: c3Opacity,
            visibility: c3Opacity > 0.01 ? "visible" : "hidden",
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
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 4: RUNWAY FINALE & ARCHIVE GATEWAY (0.78 - 1.00)                 */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-10 md:p-16 pointer-events-auto transition-opacity duration-300"
          style={{
            opacity: c4Opacity,
            transform: `translateY(${c4Y}px)`,
            visibility: c4Opacity > 0.01 ? "visible" : "hidden",
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
        </div>
      </div>
    </section>
  );
}
