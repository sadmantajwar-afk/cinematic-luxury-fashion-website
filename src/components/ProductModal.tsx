"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Plus, Minus, Check, RefreshCw, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function ProductModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [showImageChart, setShowImageChart] = useState(false);

  const product = quickViewProduct;
  const isFav = product ? isInWishlist(product.id) : false;
  const sizes = product && Array.isArray(product.sizes) ? product.sizes : ["M", "L", "XL"];
  const images = product ? [product.primaryImage, product.secondaryImage] : [];

  const handleAddToCart = () => {
    if (!product) return;
    const sizeToUse = selectedSize || sizes[0];
    addToCart(product, sizeToUse, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <div
          key={`product-modal-root-${product.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
        >
          {/* Backdrop click close */}
          <motion.div
            key="product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={closeQuickView}
          />

          {/* Modal Content Box */}
          <motion.div
            key="product-modal-container"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl h-full md:h-auto md:max-h-[92vh] bg-black border border-neutral-800 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden shadow-2xl"
          >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeQuickView}
            aria-label="Close"
            className="absolute top-4 right-4 z-30 p-2.5 bg-black/80 border border-neutral-800 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            <X size={16} />
          </motion.button>

          {/* Left Side: Editorial Image Stage */}
          <div className="w-full md:w-1/2 relative bg-neutral-950 flex flex-col justify-between overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[600px] flex-shrink-0">
            {/* Main Image with Animated Crossfade */}
            <div className="relative w-full h-full flex-grow">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`product-modal-image-${activeImageIndex}-${product.id || 'p'}`}
                  src={images[activeImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="px-2.5 py-1 bg-black/80 border border-neutral-700 text-[9px] font-mono uppercase tracking-[0.2em] text-white">
                    {product.badge}
                  </span>
                )}
                {product.campaignLook && (
                  <span className="px-2.5 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em]">
                    {product.campaignLook}
                  </span>
                )}
              </div>
            </div>

            {/* Alternate View Switcher */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-2">
              {images.map((img, idx) => (
                <motion.button
                  key={`modal-thumb-${product.id || 'p'}-${idx}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImageIndex(idx as 0 | 1)}
                  className={`relative w-12 h-16 border overflow-hidden transition-colors cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-white ring-1 ring-white"
                      : "border-neutral-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side: Editorial Information & Actions */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto bg-black text-white">
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-3">
                <span>{product.category}</span>
                <span>{product.origin}</span>
              </div>

              {/* Title & Price */}
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight uppercase text-white leading-tight">
                {product.name}
              </h2>

              <div className="mt-3 flex items-center justify-between pb-4 border-b border-neutral-900">
                <span className="text-xl md:text-2xl font-mono font-bold text-white">
                  {product.currency === "BDT"
                    ? `৳${product.price.toLocaleString()} BDT`
                    : `$${product.price.toLocaleString()} ${product.currency}`}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  COLOR: <strong className="text-white">{product.color}</strong>
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Details & Fit Pill */}
              <div className="mt-5 space-y-2.5 p-3.5 bg-neutral-950 border border-neutral-900 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                    FABRIC COMPOSITION:
                  </span>
                  <span className="text-neutral-200">{product.fabricDetails}</span>
                </div>
                <div className="pt-2 border-t border-neutral-900">
                  <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                    PROPORTION & FIT:
                  </span>
                  <span className="text-neutral-200">{product.fitInfo}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                    SELECT ARCHITECTURAL SIZE:
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[10px] font-mono uppercase underline underline-offset-4 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showSizeGuide ? "HIDE MEASUREMENTS" : "SIZE GUIDE"}
                  </button>
                </div>

                {/* Size guide popup if active */}
                {showSizeGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400" />
                        <span className="font-bold text-white uppercase tracking-wider text-[11px] sm:text-xs">
                          DREV OFFICIAL SIZE CHART
                        </span>
                      </div>

                      {/* Unit & Image Switcher */}
                      <div className="flex items-center gap-2">
                        <div className="flex border border-neutral-800 bg-black p-0.5">
                          <button
                            onClick={() => { setSizeUnit("in"); setShowImageChart(false); }}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                              sizeUnit === "in" && !showImageChart ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            INCHES
                          </button>
                          <button
                            onClick={() => { setSizeUnit("cm"); setShowImageChart(false); }}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                              sizeUnit === "cm" && !showImageChart ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            CM
                          </button>
                        </div>
                        <button
                          onClick={() => setShowImageChart(!showImageChart)}
                          className={`px-2 py-1 text-[10px] font-bold uppercase border transition-colors ${
                            showImageChart ? "border-white bg-white text-black" : "border-neutral-800 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {showImageChart ? "TABLE VIEW" : "ATELIER CARD"}
                        </button>
                      </div>
                    </div>

                    {showImageChart ? (
                      <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden border border-neutral-800 bg-neutral-900 my-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/size-chart.jpg"
                          alt="DREV Size Chart"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-2 text-center py-1.5 bg-neutral-900/60 font-black text-white text-[11px] tracking-wider border-b border-neutral-800">
                          <span>SIZE</span>
                          <span>CHEST</span>
                          <span>SHOULDER</span>
                          <span>LENGTH</span>
                          <span>SLEEVE L</span>
                        </div>

                        {/* M Row */}
                        <div
                          onClick={() => setSelectedSize("M")}
                          className={`grid grid-cols-5 gap-2 text-center py-2 transition-colors cursor-pointer text-xs ${
                            selectedSize === "M"
                              ? "bg-white text-black font-bold"
                              : "hover:bg-neutral-900/80 text-neutral-200"
                          }`}
                        >
                          <span className="font-black">M</span>
                          <span>{sizeUnit === "in" ? '41"' : '104.1 cm'}</span>
                          <span>{sizeUnit === "in" ? '18"' : '45.7 cm'}</span>
                          <span>{sizeUnit === "in" ? '26"' : '66.0 cm'}</span>
                          <span>{sizeUnit === "in" ? '22.5"' : '57.2 cm'}</span>
                        </div>

                        {/* L Row */}
                        <div
                          onClick={() => setSelectedSize("L")}
                          className={`grid grid-cols-5 gap-2 text-center py-2 transition-colors cursor-pointer text-xs ${
                            selectedSize === "L"
                              ? "bg-white text-black font-bold"
                              : "hover:bg-neutral-900/80 text-neutral-200"
                          }`}
                        >
                          <span className="font-black">L</span>
                          <span>{sizeUnit === "in" ? '43"' : '109.2 cm'}</span>
                          <span>{sizeUnit === "in" ? '18.5"' : '47.0 cm'}</span>
                          <span>{sizeUnit === "in" ? '26.5"' : '67.3 cm'}</span>
                          <span>{sizeUnit === "in" ? '24"' : '61.0 cm'}</span>
                        </div>

                        {/* XL Row */}
                        <div
                          onClick={() => setSelectedSize("XL")}
                          className={`grid grid-cols-5 gap-2 text-center py-2 transition-colors cursor-pointer text-xs ${
                            selectedSize === "XL"
                              ? "bg-white text-black font-bold"
                              : "hover:bg-neutral-900/80 text-neutral-200"
                          }`}
                        >
                          <span className="font-black">XL</span>
                          <span>{sizeUnit === "in" ? '45"' : '114.3 cm'}</span>
                          <span>{sizeUnit === "in" ? '19.5"' : '49.5 cm'}</span>
                          <span>{sizeUnit === "in" ? '27.5"' : '69.9 cm'}</span>
                          <span>{sizeUnit === "in" ? '25.5"' : '64.8 cm'}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-neutral-900 text-[10px] text-neutral-400 flex items-center justify-between">
                      <span>* CLICK ANY SIZE ROW TO SELECT</span>
                      <span className="text-neutral-500">MEASURED FLAT // ATELIER STANDARD</span>
                    </div>
                  </motion.div>
                )}

                {/* Sizes Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((sz, idx) => {
                    const isSelected = selectedSize === sz || (!selectedSize && sz === sizes[0]);
                    return (
                      <motion.button
                        key={`modal-size-${product.id || 'p'}-${sz || idx}-${idx}`}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-white text-black border-white font-bold"
                            : "bg-black text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                        }`}
                      >
                        {sz}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                  QUANTITY
                </span>
                <div className="flex items-center border border-neutral-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t border-neutral-900 flex flex-col gap-3">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-grow py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <span>ADD TO BAG</span>
                      <span>•</span>
                      <span className="font-mono">${(product.price * quantity).toLocaleString()}</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist toggle"
                  className={`p-3.5 border transition-colors cursor-pointer flex items-center justify-center ${
                    isFav
                      ? "bg-white text-black border-white"
                      : "border-neutral-800 bg-black text-white hover:border-neutral-600"
                  }`}
                >
                  <Heart size={16} className={isFav ? "fill-black" : ""} />
                </motion.button>
              </div>

              {/* Courier policy footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 pt-2">
                <span className="flex items-center gap-1">
                  <Truck size={10} /> COMPLIMENTARY EXPRESS DHL COURIER
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw size={10} /> 14-DAY WORLDWIDE RETURNS
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
