"use client";

import React, { useState } from "react";
import { Product } from "@/db/schema";
import { ShopProvider, useShop } from "@/context/ShopContext";
import Navbar from "./Navbar";
import HeroCanvasSequence from "./HeroCanvasSequence";
import CampaignDeepDive from "./CampaignDeepDive";
import ProductSection from "./ProductSection";
import LookbookStream from "./LookbookStream";
import BrandPhilosophy from "./BrandPhilosophy";
import Footer from "./Footer";
import ProductModal from "./ProductModal";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import SearchModal from "./SearchModal";
import AccountModal from "./AccountModal";

interface DrevExperienceProps {
  products: Product[];
}

function DrevContent({ products }: DrevExperienceProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { theme } = useShop();

  return (
    <div
      className={`relative min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-[#fafafa] text-[#0a0a0a]"
          : "bg-black text-white"
      }`}
    >
      {/* Minimal Sticky Navbar */}
      <Navbar onOpenAccount={() => setIsAccountOpen(true)} />

      {/* 1. Cinematic Scroll-Driven Hero Image Sequence */}
      <HeroCanvasSequence />

      {/* 2. Pinned Atelier Campaign & Construction Deep-Dive */}
      <CampaignDeepDive />

      {/* 3. Transition into Permanent Collection Product Grid */}
      <ProductSection initialProducts={products} />

      {/* 4. Runway Capsule Lookbook Carousel */}
      <LookbookStream products={products} />

      {/* 5. Brand Philosophy & Architectural Manifesto */}
      <BrandPhilosophy />

      {/* 6. Minimalist Luxury Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal products={products} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </div>
  );
}

export default function DrevExperience({ products }: DrevExperienceProps) {
  return (
    <ShopProvider>
      <DrevContent products={products} />
    </ShopProvider>
  );
}
