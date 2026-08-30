"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white border-t border-neutral-900 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono uppercase text-neutral-400">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-6">
          <span className="font-black text-white tracking-widest text-base">DREV</span>
          <span>© 2026 DREV ATELIER INC. ALL RIGHTS RESERVED.</span>
        </div>

        {/* Legal & Studio links */}
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4">
            OWNER STUDIO
          </a>
          <a href="#" className="hover:text-white transition-colors">
            PRIVACY POLICY
          </a>
          <a href="#" className="hover:text-white transition-colors">
            TERMS OF SALE
          </a>
        </div>
      </div>
    </footer>
  );
}
