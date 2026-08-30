"use client";

import React, { useState } from "react";
import { Product } from "@/db/schema";
import { ShopProvider } from "@/context/ShopContext";
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

export default function DrevExperience({ products }: DrevExperienceProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <ShopProvider>
      <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
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
    </ShopProvider>
  );
}
