"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Package, Check, ArrowRight } from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "tracking">("login");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    setTrackingResult(`Order ${orderNumber.toUpperCase()} is currently in final finishing and hand-pressing at Dhaka Atelier, Bangladesh. Estimated courier dispatch: 24-48 hours.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="account-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            key="account-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            key="account-modal-box"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md bg-black border border-neutral-800 p-6 md:p-8 text-white shadow-2xl"
          >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </motion.button>

          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
            DREV CLIENT CONCIERGE
          </div>
          <h2 className="text-2xl font-black uppercase text-white mb-6">
            PRIVATE ARCHIVE ACCESS
          </h2>

          <div className="flex border-b border-neutral-800 mb-6 text-xs font-mono relative">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-2.5 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
                activeTab === "login"
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              CLIENT PORTAL
              {activeTab === "login" && (
                <motion.div
                  layoutId="activeAccountTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`pb-2.5 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
                activeTab === "tracking"
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              ORDER LOOKUP
              {activeTab === "tracking" && (
                <motion.div
                  layoutId="activeAccountTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Welcome, client ${email}. Atelier preferences synchronized.`);
                  onClose();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    CLIENT EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@drev-archive.com"
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    PASSCODE
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  AUTHENTICATE ACCESS
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="tracking"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLookup}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    ORDER REFERENCE NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. DRV-482910"
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none uppercase"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  QUERY DISPATCH STATUS
                </motion.button>

                {trackingResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 leading-relaxed mt-4"
                  >
                    {trackingResult}
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
