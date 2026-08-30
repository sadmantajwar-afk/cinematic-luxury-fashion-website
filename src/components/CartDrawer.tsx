"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, Check } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useShop();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Checkout modal state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);

  const freeShippingThreshold = 800;
  const progressToFreeShipping = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const discountAmount = Math.round(cartTotal * (discountPercent / 100));
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "DREV2026" || promoCode.trim().toUpperCase() === "RUNWAY") {
      setDiscountPercent(15);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid campaign voucher code. Try 'DREV2026'");
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) return;

    setIsSubmittingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail,
          customerName,
          shippingAddress: shippingAddress || "Dhaka Atelier, Bangladesh Dispatch",
          items: cart.map((item) => ({
            productId: item.id,
            slug: item.slug,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal: cartTotal,
          total: finalTotal,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderConfirmation({
          orderNumber: data.order.orderNumber,
          total: finalTotal,
        });
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div key="cart-drawer-root" className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            key="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeCart}
          />

          {/* Slide drawer container */}
          <motion.div
            key="cart-drawer-slider"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg h-full bg-black border-l border-neutral-900 flex flex-col justify-between shadow-2xl text-white overflow-hidden"
          >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                CLIENT SELECTIONS
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase text-white mt-0.5">
                SHOPPING BAG [{cart.reduce((t, i) => t + i.quantity, 0)}]
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </motion.button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3 bg-neutral-950 border-b border-neutral-900">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              <span>COMPLIMENTARY COURIER OVER $800</span>
              <span className="text-white font-bold">
                {remainingForFreeShipping === 0
                  ? "UNLOCKED"
                  : `$${remainingForFreeShipping.toLocaleString()} REMAINING`}
              </span>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressToFreeShipping}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Checkout Modal Overlay if Active */}
          {isCheckingOut ? (
            <div className="p-6 overflow-y-auto flex-grow flex flex-col justify-between">
              {orderConfirmation ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center my-auto"
                >
                  <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center mb-4">
                    <Check size={24} className="text-white" />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-2">
                    ORDER CONFIRMED
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white mb-2">
                    {orderConfirmation.orderNumber}
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs font-light leading-relaxed mb-6">
                    Thank you, {customerName}. Your garment will be individually inspected, pressed, and dispatched in custom cotton garment bags.
                  </p>
                  <div className="p-4 bg-neutral-950 border border-neutral-800 text-xs font-mono w-full text-left mb-6">
                    <div className="flex justify-between py-1 border-b border-neutral-900">
                      <span className="text-neutral-500">CLIENT:</span>
                      <span className="text-white">{customerEmail}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-900">
                      <span className="text-neutral-500">DISPATCH LOCATION:</span>
                      <span className="text-white">{shippingAddress || "Dhaka Central Atelier, BD"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">BILLED TOTAL:</span>
                      <span className="text-white font-bold">${orderConfirmation.total.toLocaleString()} USD</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setOrderConfirmation(null);
                      setIsCheckingOut(false);
                      closeCart();
                    }}
                    className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 cursor-pointer"
                  >
                    RETURN TO ARCHIVE
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleCreateOrder}
                  className="space-y-4 my-auto"
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-4">
                    ATELIER CLIENT DISPATCH DETAILS
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                      FULL CLIENT NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kenji Takahashi"
                      className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                      CLIENT EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="takahashi@atelier-archive.com"
                      className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                      DESTINATION ADDRESS & CITY
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Gulshan, Dhaka / 75001 Paris"
                      className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-neutral-950 border border-neutral-900 text-xs font-mono space-y-1 mt-4">
                    <div className="flex justify-between text-neutral-400">
                      <span>ITEMS ({cart.length})</span>
                      <span>${cartTotal.toLocaleString()}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>PROMO DISCOUNT ({discountPercent}%)</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold pt-2 border-t border-neutral-800">
                      <span>FINAL TOTAL</span>
                      <span>${finalTotal.toLocaleString()} USD</span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-1/3 py-3 border border-neutral-800 text-neutral-400 text-xs font-mono uppercase hover:text-white cursor-pointer"
                    >
                      BACK
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="w-2/3 py-3 bg-white text-black text-xs font-bold font-mono uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingOrder ? "CONFIRMING..." : `PLACE ORDER ($${finalTotal.toLocaleString()})`}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </div>
          ) : (
            /* Normal Cart Items List with AnimatePresence */
            <div className="p-6 overflow-y-auto flex-grow space-y-4">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 text-center"
                >
                  <div className="text-neutral-600 mb-3 text-sm font-mono uppercase tracking-widest">
                    BAG IS CURRENTLY EMPTY
                  </div>
                  <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto mb-6">
                    Experience the runway collection and select your silhouettes.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2.5 border border-neutral-700 text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    DISCOVER PIECES
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      key={`cart-item-${item.id || item.slug || idx}-${item.size || 'default'}-${idx}`}
                      className="flex gap-4 p-3 bg-neutral-950 border border-neutral-900 group relative"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-neutral-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-tight text-white leading-tight">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-neutral-500 hover:text-white p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                            <span>SIZE: <strong className="text-white">{item.size}</strong></span>
                            <span>•</span>
                            <span>{item.color}</span>
                          </div>
                        </div>

                        {/* Price and quantity controls */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-mono font-bold text-white">
                            {item.currency === "BDT"
                              ? `৳${(item.price * item.quantity).toLocaleString()} BDT`
                              : `$${(item.price * item.quantity).toLocaleString()} ${item.currency}`}
                          </span>

                          <div className="flex items-center border border-neutral-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="px-2.5 text-[11px] font-mono text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          )}

          {/* Drawer Footer & Checkout Controls */}
          {!isCheckingOut && cart.length > 0 && (
            <div className="p-6 border-t border-neutral-900 bg-neutral-950 space-y-4">
              {/* Promo Code */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (DREV2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow px-3 py-2 bg-black border border-neutral-800 text-white text-[10px] font-mono uppercase tracking-wider focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-neutral-800 bg-black text-[10px] font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  APPLY
                </button>
              </form>
              {promoError && (
                <p className="text-[10px] text-red-400 font-mono">{promoError}</p>
              )}
              {promoApplied && (
                <p className="text-[10px] text-white font-mono flex items-center gap-1">
                  <Check size={12} /> 15% CAMPAIGN PRIVILEGE APPLIED
                </p>
              )}

              {/* Totals */}
              <div className="space-y-1.5 pt-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBTOTAL</span>
                  <span>{cart[0]?.currency === "BDT" ? `৳${cartTotal.toLocaleString()} BDT` : `$${cartTotal.toLocaleString()} USD`}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>VOUCHER DISCOUNT</span>
                    <span>{cart[0]?.currency === "BDT" ? `-৳${discountAmount.toLocaleString()} BDT` : `-$${discountAmount.toLocaleString()} USD`}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>SHIPPING</span>
                  <span>{remainingForFreeShipping === 0 ? "FREE" : (cart[0]?.currency === "BDT" ? "৳120 BDT" : "$35 USD")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-900">
                  <span>TOTAL</span>
                  <span>{cart[0]?.currency === "BDT" ? `৳${finalTotal.toLocaleString()} BDT` : `$${finalTotal.toLocaleString()} USD`}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO ATELIER CHECKOUT</span>
                <ArrowRight size={14} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
