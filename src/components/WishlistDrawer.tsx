"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    toggleWishlist,
    openQuickView,
    addToCart,
  } = useShop();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <div key="wishlist-drawer-root" className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            key="wishlist-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeWishlist}
          />

          <motion.div
            key="wishlist-drawer-slider"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md h-full bg-black border-l border-neutral-900 flex flex-col justify-between shadow-2xl text-white overflow-hidden"
          >
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                SAVED ARCHIVE
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase text-white mt-0.5">
                WISHLIST [{wishlist.length}]
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeWishlist}
              aria-label="Close wishlist"
              className="p-2 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </motion.button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow space-y-4">
            {wishlist.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <Heart size={32} className="mx-auto text-neutral-700 mb-4" />
                <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2">
                  NO SILHOUETTES CURATED YET
                </div>
                <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto mb-6">
                  Tap the heart icon on any runway look or garment to reserve it in your private moodboard.
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-5 py-2.5 border border-neutral-800 text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  BROWSE PIECES
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    key={`wishlist-${item.id || item.slug || idx}`}
                    className="flex gap-4 p-3 bg-neutral-950 border border-neutral-900"
                  >
                    <div
                      onClick={() => {
                        closeWishlist();
                        openQuickView(item);
                      }}
                      className="relative w-20 h-24 flex-shrink-0 cursor-pointer overflow-hidden bg-neutral-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4
                            onClick={() => {
                              closeWishlist();
                              openQuickView(item);
                            }}
                            className="text-xs font-bold uppercase tracking-tight text-white hover:underline cursor-pointer"
                          >
                            {item.name}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-neutral-500 hover:text-white p-1 cursor-pointer"
                            aria-label="Remove"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400 mt-1">
                          {item.color}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {item.currency === "BDT"
                            ? `৳${item.price.toLocaleString()} BDT`
                            : `$${item.price.toLocaleString()} ${item.currency}`}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const sz = Array.isArray(item.sizes) ? item.sizes[0] : "M";
                            addToCart(item, sz, 1);
                          }}
                          className="px-2.5 py-1 bg-white text-black text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-neutral-200 cursor-pointer"
                        >
                          ADD TO BAG
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {wishlist.length > 0 && (
            <div className="p-6 border-t border-neutral-900 bg-neutral-950">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  wishlist.forEach((item) => {
                    const sz = Array.isArray(item.sizes) ? item.sizes[0] : "M";
                    addToCart(item, sz, 1);
                  });
                  closeWishlist();
                }}
                className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                MOVE ALL TO BAG
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
