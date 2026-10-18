"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
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
    theme,
    toggleTheme,
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
    <>
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? theme === "light"
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200 py-3.5 text-black"
            : "bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3.5 text-white"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left Side: Brand Logo & Primary Editorial Nav */}
        <div className="flex items-center gap-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={`text-2xl sm:text-3xl font-black tracking-[-0.05em] uppercase hover:opacity-80 transition-all cursor-pointer select-none ${
              isScrolled && theme === "light" ? "text-black" : "text-white"
            }`}
          >
            DREV
          </motion.button>

          {/* Desktop Links */}
          <nav
            className={`hidden lg:flex items-center gap-7 text-[11px] font-mono tracking-[0.2em] uppercase transition-colors ${
              isScrolled && theme === "light" ? "text-neutral-600" : "text-neutral-400"
            }`}
          >
            <button
              onClick={() => scrollToSection("products-section")}
              className={`transition-colors cursor-pointer ${
                isScrolled && theme === "light" ? "hover:text-black" : "hover:text-white"
              }`}
            >
              SHOP
            </button>
            <button
              onClick={() => scrollToSection("products-section")}
              className={`transition-colors cursor-pointer ${
                isScrolled && theme === "light" ? "hover:text-black" : "hover:text-white"
              }`}
            >
              NEW ARRIVALS
            </button>
            <button
              onClick={() => scrollToSection("campaign-section")}
              className={`transition-colors cursor-pointer ${
                isScrolled && theme === "light" ? "hover:text-black" : "hover:text-white"
              }`}
            >
              COLLECTIONS
            </button>
            <button
              onClick={() => scrollToSection("manifesto-section")}
              className={`transition-colors cursor-pointer ${
                isScrolled && theme === "light" ? "hover:text-black" : "hover:text-white"
              }`}
            >
              ABOUT
            </button>
          </nav>
        </div>

        {/* Right Side: Utilities (Search, Account, Wishlist, Theme Toggle, Cart) */}
        <div className="flex items-center gap-2.5 sm:gap-4">

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openSearch}
            aria-label="Search archive"
            className={`hidden sm:flex p-2 transition-colors cursor-pointer items-center gap-1.5 ${
              isScrolled && theme === "light"
                ? "text-neutral-700 hover:text-black"
                : "text-neutral-300 hover:text-white"
            }`}
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
            className={`hidden sm:flex p-2 transition-colors cursor-pointer items-center gap-1.5 ${
              isScrolled && theme === "light"
                ? "text-neutral-700 hover:text-black"
                : "text-neutral-300 hover:text-white"
            }`}
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
            className={`hidden sm:flex p-2 transition-colors cursor-pointer relative items-center gap-1.5 ${
              isScrolled && theme === "light"
                ? "text-neutral-700 hover:text-black"
                : "text-neutral-300 hover:text-white"
            }`}
          >
            <Heart size={16} />
            <span className="text-[11px] font-mono tracking-wider hidden md:inline">
              WISHLIST
            </span>
            {mounted && wishlist.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-4 h-4 rounded-full font-mono font-bold text-[9px] flex items-center justify-center -ml-0.5 ${
                  isScrolled && theme === "light" ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {wishlist.length}
              </motion.span>
            )}
          </motion.button>

          {/* Theme Toggle Button (Light / Dark) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border transition-colors cursor-pointer text-[10px] font-mono uppercase tracking-wider ${
              isScrolled && theme === "light"
                ? "border-neutral-300 bg-neutral-100 text-neutral-800 hover:border-black hover:text-black"
                : "border-neutral-800 bg-black/60 text-neutral-300 hover:text-white hover:border-neutral-600"
            }`}
          >
            {theme === "dark" ? (
              <>
                <Sun size={13} className="text-amber-400" />
                <span className="hidden sm:inline font-bold">LIGHT</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-neutral-800" />
                <span className="hidden sm:inline font-bold">DARK</span>
              </>
            )}
          </motion.button>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            aria-label="Shopping Bag"
            className={`px-3 py-1.5 font-mono font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
              isScrolled && theme === "light"
                ? "bg-black text-white hover:bg-neutral-800"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            <ShoppingBag size={14} />
            <span>SHOP [{mounted ? cartCount : 0}]</span>
          </motion.button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-3 -mr-2 cursor-pointer select-none touch-manipulation transition-colors ${
              isScrolled && theme === "light"
                ? "text-neutral-800 hover:text-black"
                : "text-neutral-300 hover:text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </motion.header>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="navbar-mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden fixed inset-0 top-[60px] backdrop-blur-xl border-t flex flex-col justify-between p-8 z-50 overflow-y-auto ${
              theme === "light"
                ? "bg-white/98 border-neutral-200 text-black"
                : "bg-black/95 border-neutral-900 text-white"
            }`}
          >
            <nav className={`space-y-6 pt-6 text-xl font-bold uppercase tracking-tight ${
              theme === "light" ? "text-black" : "text-white"
            }`}>
              <button
                onClick={() => scrollToSection("products-section")}
                className={`block text-left w-full cursor-pointer transition-colors ${
                  theme === "light" ? "hover:text-neutral-500" : "hover:text-neutral-400"
                }`}
              >
                SHOP RUNWAY COLLECTION
              </button>
              <button
                onClick={() => scrollToSection("products-section")}
                className={`block text-left w-full cursor-pointer transition-colors ${
                  theme === "light" ? "hover:text-neutral-500" : "hover:text-neutral-400"
                }`}
              >
                NEW ARRIVALS
              </button>
              <button
                onClick={() => scrollToSection("campaign-section")}
                className={`block text-left w-full cursor-pointer transition-colors ${
                  theme === "light" ? "hover:text-neutral-500" : "hover:text-neutral-400"
                }`}
              >
                CAMPAIGN 01 // RUNWAY
              </button>
              <a
                href="/admin"
                className={`block text-left w-full cursor-pointer font-mono text-sm pt-2 transition-colors ${
                  theme === "light" ? "text-neutral-600 hover:text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                OWNER STUDIO / ADMIN [→]
              </a>
            </nav>

            <div className={`pt-6 border-t space-y-4 text-xs font-mono ${
              theme === "light" ? "border-neutral-200" : "border-neutral-900"
            }`}>
              {/* Theme Toggle row in Mobile Drawer */}
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-between w-full py-3 px-4 border transition-colors cursor-pointer text-xs font-mono uppercase tracking-widest ${
                  theme === "light"
                    ? "border-neutral-300 bg-neutral-100 text-black hover:border-black"
                    : "border-neutral-800 bg-neutral-950 text-white hover:border-neutral-600"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-neutral-700" />}
                  <span>THEME: {theme === "dark" ? "DARK MODE" : "LIGHT MODE"}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 border border-current">
                  {theme === "dark" ? "LIGHT [○]" : "DARK [●]"}
                </span>
              </button>

              <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
                DHAKA, BD • PARIS • MILAN • NEW YORK
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
