"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useShop } from "@/context/ShopContext";

interface NavbarProps {
  onOpenAccount: () => void;
}

export default function Navbar({ onOpenAccount }: NavbarProps) {
  const {
    openCart,
    cartCount,
    openWishlist,
    wishlist,
    openSearch,
    isAudioPlaying,
    toggleAudio,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3.5"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left Side: Brand Logo & Primary Editorial Nav */}
        <div className="flex items-center gap-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="text-2xl sm:text-3xl font-black tracking-[-0.05em] uppercase text-white hover:opacity-80 transition-opacity cursor-pointer select-none"
          >
            DREV
          </motion.button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">
            <button
              onClick={() => scrollToSection("products-section")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              SHOP
            </button>
            <button
              onClick={() => scrollToSection("products-section")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              NEW ARRIVALS
            </button>
            <button
              onClick={() => scrollToSection("campaign-section")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <button
              onClick={() => scrollToSection("manifesto-section")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ABOUT
            </button>
          </nav>
        </div>

        {/* Right Side: Utilities (Sound, Search, Account, Wishlist, Cart) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Ambient Sound Toggle with Equalizer bars */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 border transition-colors cursor-pointer text-[10px] font-mono uppercase tracking-wider ${
              isAudioPlaying
                ? "border-white bg-white text-black font-bold"
                : "border-neutral-800 bg-black/60 text-neutral-400 hover:text-white hover:border-neutral-600"
            }`}
            title="Toggle runway ambient atmospheric audio"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 size={12} />
                <span>SOUND ON</span>
                <span className="flex gap-0.5 items-end h-2.5">
                  <motion.span
                    animate={{ height: ["4px", "10px", "5px", "12px", "4px"] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                    className="w-0.5 bg-black"
                  />
                  <motion.span
                    animate={{ height: ["8px", "4px", "12px", "6px", "8px"] }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
                    className="w-0.5 bg-black"
                  />
                  <motion.span
                    animate={{ height: ["5px", "11px", "4px", "9px", "5px"] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                    className="w-0.5 bg-black"
                  />
                </span>
              </>
            ) : (
              <>
                <VolumeX size={12} />
                <span>SOUND</span>
              </>
            )}
          </motion.button>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openSearch}
            aria-label="Search archive"
            className="hidden sm:flex p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer items-center gap-1.5"
          >
            <Search size={16} />
            <span className="text-[11px] font-mono tracking-wider hidden md:inline">
              SEARCH
            </span>
          </motion.button>

          {/* Account Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAccount}
            aria-label="Atelier Client Portal"
            className="hidden sm:flex p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer items-center gap-1.5"
          >
            <User size={16} />
            <span className="text-[11px] font-mono tracking-wider hidden md:inline">
              ACCOUNT
            </span>
          </motion.button>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openWishlist}
            aria-label="Saved items"
            className="hidden sm:flex p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer relative items-center gap-1.5"
          >
            <Heart size={16} />
            <span className="text-[11px] font-mono tracking-wider hidden md:inline">
              WISHLIST
            </span>
            {mounted && wishlist.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 rounded-full bg-white text-black font-mono font-bold text-[9px] flex items-center justify-center -ml-0.5"
              >
                {wishlist.length}
              </motion.span>
            )}
          </motion.button>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            aria-label="Shopping Bag"
            className="px-3 py-1.5 bg-white text-black font-mono font-bold text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>SHOP [{mounted ? cartCount : 0}]</span>
          </motion.button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 -mr-2 text-neutral-300 hover:text-white cursor-pointer select-none touch-manipulation"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="navbar-mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-xl border-t border-neutral-900 flex flex-col justify-between p-8 z-50 overflow-y-auto"
          >
            <nav className="space-y-6 pt-6 text-xl font-bold uppercase tracking-tight text-white">
              <button
                onClick={() => scrollToSection("products-section")}
                className="block hover:text-neutral-400 text-left w-full cursor-pointer"
              >
                SHOP RUNWAY COLLECTION
              </button>
              <button
                onClick={() => scrollToSection("products-section")}
                className="block hover:text-neutral-400 text-left w-full cursor-pointer"
              >
                NEW ARRIVALS
              </button>
              <button
                onClick={() => scrollToSection("campaign-section")}
                className="block hover:text-neutral-400 text-left w-full cursor-pointer"
              >
                CAMPAIGN 01 // RUNWAY
              </button>
              <a
                href="/admin"
                className="block text-neutral-400 hover:text-white text-left w-full cursor-pointer font-mono text-sm pt-2"
              >
                OWNER STUDIO / ADMIN [→]
              </a>
            </nav>

            <div className="space-y-4 pt-6 border-t border-neutral-900 text-xs font-mono">
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 text-neutral-300 py-2 w-full text-left cursor-pointer"
              >
                {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{isAudioPlaying ? "MUTE AMBIENT SOUND" : "ACTIVATE AMBIENT SOUND"}</span>
              </button>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest pt-4">
                DHAKA, BD • PARIS • MILAN • NEW YORK
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
