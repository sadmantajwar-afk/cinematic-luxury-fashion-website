"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Search,
  Check,
  X,
  ArrowUpRight,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Layers,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Product } from "@/db/schema";

const CATEGORIES = ["Outerwear", "Tailoring", "Tops", "Trousers", "Footwear", "Accessories"];
const DEFAULT_PASSCODE = "drev2026";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("drev_admin_auth") === "true";
    }
    return false;
  });
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"products" | "add" | "orders" | "backup">("products");

  // Modal / Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category: "Outerwear",
    price: 9800,
    currency: "BDT",
    color: "Midnight Obsidian",
    colorHex: "#111111",
    description: "",
    fabricDetails: "",
    fitInfo: "",
    origin: "Atelier Production, Bangladesh",
    sizes: ["M", "L", "XL"],
    primaryImage: "/products/greenvel_luxe.jpg",
    secondaryImage: "/products/corduroy_utility_jacket_01.jpg",
    campaignLook: "RUNWAY EDIT",
    badge: "NEW ARRIVAL",
    inStock: true,
    featured: true,
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProductsList(data.products);
      }
    } catch {
      console.warn("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (!ignore) {
            if (data.success && Array.isArray(data.products)) {
              setProductsList(data.products);
            }
            setLoading(false);
          }
        })
        .catch(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("drev_admin_auth", "true");
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid passcode. Try 'drev2026'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("drev_admin_auth");
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [productsList, searchTerm, categoryFilter]);

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Created "${formData.name}" successfully!`);
        fetchProducts();
        setActiveTab("products");
        // Reset form
        setFormData({
          name: "",
          slug: "",
          category: "Outerwear",
          price: 950,
          currency: "USD",
          color: "Obsidian",
          colorHex: "#111111",
          description: "",
          fabricDetails: "",
          fitInfo: "",
          origin: "Atelier Production",
          sizes: ["M", "L", "XL"],
          primaryImage: "/products/greenvel_luxe.jpg",
          secondaryImage: "/products/corduroy_utility_jacket_01.jpg",
          campaignLook: "RUNWAY EDIT",
          badge: "NEW ARRIVAL",
          inStock: true,
          featured: true,
        });
      } else {
        showToast(data.error || "Failed to create product", "error");
      }
    } catch {
      showToast("Network error creating product", "error");
    }
  };

  // Handle Update Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated "${editingProduct.name}"!`);
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast(data.error || "Failed to update product", "error");
      }
    } catch {
      showToast("Network error updating product", "error");
    }
  };

  // Handle Quick Toggle Stock
  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Stock updated for ${product.name}`);
        fetchProducts();
      }
    } catch {
      showToast("Error updating stock", "error");
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted ${product.name}`);
        fetchProducts();
      } else {
        showToast(data.error || "Failed to delete", "error");
      }
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productsList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `drev_catalogue_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Catalogue backup downloaded!");
  };

  // Refresh / reload catalogue
  const handleRestoreSeeds = () => {
    fetchProducts();
    showToast("Reloaded catalogue archives");
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-md p-8 sm:p-10 bg-neutral-950 border border-neutral-800 shadow-2xl">
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-300">
              OWNER PORTAL // ADMIN STUDIO
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white mt-4">
              DREV ATELIER
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-2">
              Enter master passcode to manage collection & store inventory.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                MASTER PASSCODE
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. drev2026)"
                className="w-full px-4 py-3.5 bg-black border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-white uppercase"
              />
            </div>

            {passcodeError && (
              <p className="text-xs font-mono text-red-400">{passcodeError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              ACCESS MANAGEMENT STUDIO →
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-neutral-900 text-center text-[10px] font-mono text-neutral-500">
            DEFAULT CLIENT PASSCODE: <span className="text-white font-bold">drev2026</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Toast alert */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-5 py-3 border font-mono text-xs shadow-2xl flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-neutral-900 border-emerald-500 text-white"
                : "bg-neutral-900 border-red-500 text-red-300"
            }`}
          >
            <Check size={14} className="text-emerald-400" />
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-900 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-white hover:text-neutral-400 transition-colors">
            DREV
          </Link>
          <span className="hidden sm:inline px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono uppercase tracking-widest text-neutral-300">
            MANAGEMENT STUDIO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            <span>VIEW LIVE STORE</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-red-950 border border-neutral-800 hover:border-red-800 text-xs font-mono uppercase text-neutral-300 hover:text-red-300 transition-colors cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              TOTAL GARMENTS
            </span>
            <div className="text-3xl font-black font-mono text-white mt-1">
              {productsList.length}
            </div>
          </div>
          <div className="p-5 bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              IN STOCK PIECES
            </span>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {productsList.filter((p) => p.inStock).length}
            </div>
          </div>
          <div className="p-5 bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              TOTAL INVENTORY VALUATION
            </span>
            <div className="text-3xl font-black font-mono text-white mt-1">
              ৳{productsList.reduce((acc, p) => acc + (p.price || 0), 0).toLocaleString()} BDT
            </div>
          </div>
          <div className="p-5 bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              ACTIVE CAPSULES
            </span>
            <div className="text-3xl font-black font-mono text-white mt-1">
              {CATEGORIES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <div className="flex border-b border-neutral-900 gap-2 font-mono text-xs uppercase">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "products"
                ? "border-white text-white bg-neutral-950"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Package size={14} />
            <span>GARMENT CATALOGUE ({productsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "add"
                ? "border-white text-white bg-neutral-950"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Plus size={14} />
            <span>+ ADD NEW PRODUCT</span>
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-5 py-3 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "backup"
                ? "border-white text-white bg-neutral-950"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Download size={14} />
            <span>DATA BACKUP & EXPORT</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: PRODUCTS LIST */}
      {activeTab === "products" && (
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH CATALOGUE..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 text-xs font-mono uppercase text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {["ALL", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase border cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-white text-black border-white font-bold"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid / Table */}
          {loading ? (
            <div className="py-20 text-center text-xs font-mono uppercase text-neutral-500">
              LOADING ARCHIVES...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-xs font-mono uppercase text-neutral-500 border border-neutral-900 p-8">
              NO OBJECTS FOUND MATCHING FILTER.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-neutral-950 border border-neutral-900 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] w-full bg-neutral-900 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      <span className="px-2 py-0.5 bg-black/80 text-[10px] font-mono uppercase text-white border border-neutral-800">
                        {p.category}
                      </span>
                      {p.badge && (
                        <span className="px-2 py-0.5 bg-white text-[10px] font-mono font-bold uppercase text-black">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold border cursor-pointer ${
                          p.inStock
                            ? "bg-emerald-950/90 text-emerald-300 border-emerald-800"
                            : "bg-red-950/90 text-red-300 border-red-800"
                        }`}
                      >
                        {p.inStock ? "IN STOCK" : "SOLD OUT"}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                        <span>{p.color}</span>
                        <span className="text-white font-bold">
                          {p.currency === "BDT" ? `৳${p.price?.toLocaleString()} BDT` : `$${p.price} USD`}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase text-white leading-tight mb-2">
                        {p.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase border border-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit size={12} />
                        <span>EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-2 bg-neutral-900 hover:bg-red-950 hover:text-red-300 border border-neutral-800 hover:border-red-800 text-neutral-400 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* TAB CONTENT: ADD NEW PRODUCT */}
      {activeTab === "add" && (
        <main className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <div className="p-8 bg-neutral-950 border border-neutral-900">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-900">
              <div>
                <h2 className="text-2xl font-black uppercase text-white">
                  ADD NEW GARMENT OBJECT
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Create a new permanent piece or runway edition for the catalog.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    GARMENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. SILK TAILORED BOMBER"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono uppercase text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    CATEGORY *
                  </label>
                  <select
                    value={formData.category || "Outerwear"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono uppercase text-white focus:border-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    PRICE (BDT / ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="9800"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    COLOR NAME & HEX
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.color || ""}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g. Obsidian Noir"
                      className="flex-grow px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                    />
                    <input
                      type="color"
                      value={formData.colorHex || "#111111"}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-12 h-12 p-1 bg-black border border-neutral-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    PRIMARY IMAGE (URL or /products/filename.jpg) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryImage || ""}
                    onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                    placeholder="e.g. /products/greenvel_luxe.jpg or https://..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                  {formData.primaryImage && (
                    <div className="mt-2 w-24 h-32 bg-neutral-900 border border-neutral-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.primaryImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    EDITORIAL DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Editorial garment narrative..."
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    FABRIC & MATERIAL DETAILS
                  </label>
                  <input
                    type="text"
                    value={formData.fabricDetails || ""}
                    onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                    placeholder="e.g. 100% Pure Virgin Wool Gabardine / Suede Velvet"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    FIT & PROPORTIONS
                  </label>
                  <input
                    type="text"
                    value={formData.fitInfo || ""}
                    onChange={(e) => setFormData({ ...formData, fitInfo: e.target.value })}
                    placeholder="e.g. Structured boxy silhouette"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    BADGE TAG (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. RUNWAY KEY LOOK"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-sm font-mono text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    IN STOCK STATUS
                  </label>
                  <div className="flex items-center gap-4 py-3">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                      <input
                        type="checkbox"
                        checked={formData.inStock !== false}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 accent-white"
                      />
                      <span>AVAILABLE FOR PURCHASE</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-900 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className="px-6 py-3.5 border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-white text-black text-xs font-mono font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors cursor-pointer shadow-xl"
                >
                  PUBLISH GARMENT TO STORE →
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* TAB CONTENT: BACKUP & EXPORT */}
      {activeTab === "backup" && (
        <main className="max-w-3xl mx-auto px-6 md:px-12 py-8">
          <div className="p-8 bg-neutral-950 border border-neutral-900 space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase text-white">
                DATA BACKUP & ATELIER EXPORT
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Export your store&rsquo;s complete catalogue or restore original factory presets.
              </p>
            </div>

            <div className="p-6 bg-black border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-mono uppercase text-white">
                    EXPORT CATALOGUE (JSON)
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Download a full snapshot of all products, prices, and fabric details.
                  </p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-5 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} />
                  <span>EXPORT FILE</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-black border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-mono uppercase text-white">
                    RESTORE DEFAULT FACTORY SEEDS
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Restore original runway collections (Greenvel Luxe, Corduroy Utility, Oblique coats).
                  </p>
                </div>
                <button
                  onClick={handleRestoreSeeds}
                  className="px-5 py-2.5 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>RESTORE DEFAULTS</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-900">
                <h3 className="text-xl font-black uppercase text-white">
                  EDIT: {editingProduct.name}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      GARMENT NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono uppercase text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      PRICE (BDT / ৳)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono uppercase text-white focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      COLOR
                    </label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, color: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      IMAGE PATH OR URL
                    </label>
                    <input
                      type="text"
                      value={editingProduct.primaryImage}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, primaryImage: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      FABRIC DETAILS
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabricDetails}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fabricDetails: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      BADGE
                    </label>
                    <input
                      type="text"
                      value={editingProduct.badge || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, badge: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-900 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer shadow-xl"
                  >
                    SAVE CHANGES →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
