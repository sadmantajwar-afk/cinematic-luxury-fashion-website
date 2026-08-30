"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/db/schema";

interface LookbookStreamProps {
  products: Product[];
}

export default function LookbookStream({ products }: LookbookStreamProps) {
  const { openQuickView } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Looks curated from products
  const campaignLooks = products.slice(0, 6);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? campaignLooks.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === campaignLooks.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full bg-black text-white py-20 md:py-28 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-neutral-900"
        >
          <div>
            <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-neutral-400 mb-1.5 font-bold">
              EDITORIAL CAMPAIGN ARCHIVE
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
              RUNWAY CAPSULE 01
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-neutral-400 mr-2 font-bold">
              LOOK {String(currentIndex + 1).padStart(2, "0")} / {String(campaignLooks.length).padStart(2, "0")}
            </span>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={prevSlide}
              aria-label="Previous look"
              className="p-3 border border-neutral-700 hover:border-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={nextSlide}
              aria-label="Next look"
              className="p-3 border border-neutral-700 hover:border-white transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Big Editorial Slide View with AnimatePresence */}
        {campaignLooks.length > 0 && (
          <div className="relative min-h-[480px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`lookbook-slide-${currentIndex}-${campaignLooks[currentIndex]?.id || 'look'}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Image Stage */}
                <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/3] bg-neutral-950 overflow-hidden border border-neutral-900 group gpu-accel">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaignLooks[currentIndex].primaryImage}
                    alt={campaignLooks[currentIndex].name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-6 left-6 z-10">
                    <span className="px-4 py-1.5 bg-white text-black text-xs sm:text-sm font-black uppercase tracking-widest">
                      {campaignLooks[currentIndex].campaignLook || `LOOK 0${currentIndex + 1}`}
                    </span>
                  </div>
                </div>

                {/* Right Information Stage */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2 font-bold">
                      RUNWAY ARCHIVE // {campaignLooks[currentIndex].category}
                    </div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                      {campaignLooks[currentIndex].name}
                    </h3>
                    <div className="mt-4 text-xl sm:text-2xl font-mono font-bold text-white">
                      {campaignLooks[currentIndex].currency === "BDT"
                        ? `৳${campaignLooks[currentIndex].price.toLocaleString()} BDT`
                        : `$${campaignLooks[currentIndex].price.toLocaleString()} USD`}
                    </div>
                    <p className="mt-4 text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                      {campaignLooks[currentIndex].description}
                    </p>

                    <div className="mt-6 pt-4 border-t border-neutral-800 space-y-2.5 text-xs sm:text-sm font-mono text-neutral-300">
                      <div><span className="text-white font-bold">MATERIAL:</span> {campaignLooks[currentIndex].fabricDetails}</div>
                      <div><span className="text-white font-bold">PROPORTIONS:</span> {campaignLooks[currentIndex].fitInfo}</div>
                      <div><span className="text-white font-bold">ORIGIN:</span> {campaignLooks[currentIndex].origin}</div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openQuickView(campaignLooks[currentIndex])}
                      className="px-8 py-4 bg-white text-black text-xs sm:text-sm font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors flex items-center gap-2.5 cursor-pointer shadow-xl"
                    >
                      <Eye size={16} />
                      <span>VIEW SPECIFICATIONS</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
