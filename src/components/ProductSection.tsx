"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/db/schema";
import ProductCard from "./ProductCard";
import { ArrowUpDown, Layers, Grid } from "lucide-react";
import { useShop } from "@/context/ShopContext";

interface ProductSectionProps {
  initialProducts: Product[];
}

const CATEGORIES = ["ALL", "OUTERWEAR", "TAILORING", "TOPS", "TROUSERS", "FOOTWEAR", "ACCESSORIES"];

export default function ProductSection({ initialProducts }: ProductSectionProps) {
  const { openQuickView } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory !== "ALL") {
      list = list.filter(
        (p) => p.category.toUpperCase() === selectedCategory.toUpperCase()
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: featured first, then id
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [initialProducts, selectedCategory, sortBy]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialProducts.length };
    initialProducts.forEach((p) => {
      const cat = p.category.toUpperCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  return (
    <section id="products-section" className="relative w-full bg-black text-white py-16 md:py-24 border-t border-neutral-900">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-900"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 mb-2">
              <span className="w-2 h-2 bg-white" />
              <span>CATALOGUE RAISONNÉ // COLLECTION 01</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-white">
              THE PERMANENT EDIT
            </h2>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-neutral-300 font-normal max-w-2xl leading-relaxed">
              Strict wardrobe essentials engineered in Dhaka, Bangladesh. Emerald suede velvets, 8-wale corduroys, high-twist virgin wools, and hand-finished zardosi craft.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-neutral-400">DISPLAYING:</span>
            <span className="text-white font-bold tracking-wider">
              {filteredProducts.length} OF {initialProducts.length} OBJECTS
            </span>
          </div>
        </motion.div>

        {/* Filter and Control Bar */}
        <div className="mt-8 sm:mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat, idx) => {
              const count = categoryCounts[cat] || 0;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={`category-${cat || idx}`}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative flex-shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-mono uppercase tracking-[0.15em] sm:tracking-[0.18em] transition-colors cursor-pointer border border-neutral-800"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? "text-black font-black" : "text-neutral-300 hover:text-white"}`}>
                    {cat} <span className="text-[10px] sm:text-xs opacity-75">[{count}]</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* View and Layout Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative flex items-center border border-neutral-800 bg-black">
              <span className="pl-3.5 text-neutral-400 text-sm">
                <ArrowUpDown size={14} />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="py-2.5 pl-2.5 pr-10 text-xs sm:text-sm font-mono uppercase tracking-wider bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-black text-white">
                  CURATED / FEATURED
                </option>
                <option value="price-asc" className="bg-black text-white">
                  PRICE: LOW TO HIGH
                </option>
                <option value="price-desc" className="bg-black text-white">
                  PRICE: HIGH TO LOW
                </option>
                <option value="name" className="bg-black text-white">
                  ALPHABETICAL
                </option>
              </select>
            </div>

            {/* Grid Density Toggle */}
            <div className="hidden sm:flex items-center border border-neutral-800">
              <button
                onClick={() => setGridColumns(3)}
                aria-label="3 columns grid"
                className={`p-2 transition-colors cursor-pointer ${
                  gridColumns === 3
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                aria-label="4 columns grid"
                className={`p-2 transition-colors cursor-pointer ${
                  gridColumns === 4
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Layers size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid with AnimatePresence */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center border border-neutral-900 p-8"
          >
            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
              No garments found in this category
            </h3>
            <p className="text-xs text-neutral-500 font-mono">
              TRY SELECTING ALL OBJECTS TO EXPLORE THE FULL RUNWAY ARCHIVE
            </p>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className="mt-6 px-5 py-2.5 bg-white text-black text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 cursor-pointer"
            >
              RESET FILTERS
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridColumns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } border-t border-l border-neutral-900`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={`product-item-${product.id || (product as any).slug || idx}`}
                  product={product}
                  onSelect={openQuickView}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
