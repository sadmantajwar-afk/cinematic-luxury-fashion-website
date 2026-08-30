"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowUpRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/db/schema";

interface SearchModalProps {
  products: Product[];
}

const QUICK_TAGS = ["CORDUROY", "VELVET", "OVERCOAT", "BOMBER", "TROUSERS", "DERBY", "HOODIE", "TAILORING"];

export default function SearchModal({ products }: SearchModalProps) {
  const { isSearchOpen, closeSearch, openQuickView } = useShop();
  const [searchTerm, setSearchTerm] = useState("");

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.color.toLowerCase().includes(term)
    );
  }, [searchTerm, products]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          key="search-modal-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl text-white"
        >
        {/* Top bar with input & close */}
        <div className="p-6 md:p-12 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-grow max-w-4xl">
            <Search size={22} className="text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH GARMENTS, SILHOUETTES, MATERIALS..."
              className="w-full bg-transparent text-xl md:text-3xl font-extrabold uppercase tracking-tight text-white placeholder-neutral-700 focus:outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeSearch}
            aria-label="Close search"
            className="p-3 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Quick Tags */}
        <div className="px-6 md:px-12 py-4 border-b border-neutral-900 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 uppercase tracking-widest mr-2">
            SUGGESTIONS:
          </span>
          {QUICK_TAGS.map((tag, idx) => (
            <motion.button
              key={`search-tag-${tag || idx}-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
            >
              {tag}
            </motion.button>
          ))}
        </div>

        {/* Results view */}
        <div className="flex-grow overflow-y-auto p-6 md:p-12 max-w-7xl mx-auto w-full">
          {searchTerm && results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <h3 className="text-lg font-mono uppercase text-neutral-400 mb-2">
                NO MATCHES FOR &ldquo;{searchTerm}&rdquo;
              </h3>
              <p className="text-xs text-neutral-600 font-mono">
                TRY SEARCHING BY FABRIC (WOOL, GABARDINE, CALFSKIN) OR SILHOUETTE
              </p>
            </motion.div>
          ) : results.length > 0 ? (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-6">
                FOUND {results.length} SILHOUETTES MATCHING INQUIRY
              </div>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {results.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      key={`search-result-${product.id || product.slug || idx}`}
                      onClick={() => {
                        closeSearch();
                        openQuickView(product);
                      }}
                      className="group p-3 bg-neutral-950 border border-neutral-900 hover:border-neutral-700 cursor-pointer transition-colors"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900 relative mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 uppercase">
                        {product.category} • {product.color}
                      </div>
                      <h4 className="text-xs font-bold uppercase text-white mt-1 group-hover:underline">
                        {product.name}
                      </h4>
                      <div className="mt-2 text-xs font-mono font-bold text-white">
                        {product.currency === "BDT"
                          ? `৳${product.price.toLocaleString()} BDT`
                          : `$${product.price.toLocaleString()} ${product.currency}`}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center max-w-md mx-auto"
            >
              <p className="text-xs uppercase font-mono tracking-[0.25em] text-neutral-500 mb-4">
                ENTER AN INQUIRY TO EXPLORE THE ATELIER DATABASE
              </p>
              <p className="text-xs text-neutral-600 font-light">
                Search by silhouette name, material composition, or runway look number.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
