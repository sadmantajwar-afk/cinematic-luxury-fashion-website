"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Check, ArrowUpRight } from "lucide-react";
import { Product } from "@/db/schema";
import { useShop } from "@/context/ShopContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const sizes = Array.isArray(product.sizes) ? product.sizes : ["S", "M", "L"];

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-black cursor-pointer select-none text-white border-b border-r border-neutral-900 transition-colors hover:border-neutral-700"
    >
      {/* Top micro badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.badge && (
          <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-neutral-700 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
            {product.badge}
          </span>
        )}
        {product.campaignLook && (
          <span className="px-2.5 py-1 bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            {product.campaignLook}
          </span>
        )}
      </div>

      {/* Wishlist toggle micro-button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlistClick}
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-3 right-3 z-10 p-2.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            isFavorite ? "fill-white text-white" : ""
          }`}
        />
      </motion.button>

      {/* Editorial Image Container (3:4 aspect ratio) */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950 gpu-accel">
        {/* Primary Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.primaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Secondary Image (Crossfade on Hover) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.secondaryImage}
          alt={`${product.name} alternate view`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Subtle Vignette & Grain */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Quick Add Size Bar (Reveals on Hover) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 w-full p-3.5 bg-black/90 backdrop-blur-md border-t border-neutral-800 transition-all duration-300 flex flex-col gap-2 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-bold">
            <span>QUICK ADD SIZE:</span>
            {justAdded && (
              <span className="text-white font-black flex items-center gap-1">
                <Check size={12} /> ADDED TO BAG
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sz, idx) => (
              <motion.button
                key={`card-size-${product.id || product.slug || 'p'}-${sz || idx}-${idx}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleQuickAdd(e, sz)}
                className="flex-1 py-2 px-2 text-xs font-mono font-bold uppercase tracking-wider border border-neutral-700 bg-neutral-900 hover:bg-white hover:text-black hover:border-white transition-colors cursor-pointer text-center"
              >
                {sz}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-1.5 font-medium">
            <span>{product.category}</span>
            <span>{product.color}</span>
          </div>

          <h3 className="text-sm sm:text-base font-black tracking-tight uppercase text-white group-hover:text-neutral-300 transition-colors flex items-center justify-between">
            <span>{product.name}</span>
            <ArrowUpRight
              size={16}
              className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between">
          <span className="text-sm sm:text-base font-mono font-bold text-white">
            {product.currency === "BDT"
              ? `৳${product.price.toLocaleString()} BDT`
              : `$${product.price.toLocaleString()} ${product.currency}`}
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors font-bold">
            EXPLORE →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
