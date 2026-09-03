import { db } from "@/db";
import { products } from "@/db/schema";
import { initialProducts, seed } from "@/db/seed";
import DrevExperience from "@/components/DrevExperience";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let allProducts = initialProducts;

  if (process.env.DATABASE_URL) {
    try {
      const dbProducts = await db.select().from(products);
      if (dbProducts && dbProducts.length > 0) {
        allProducts = dbProducts;
      } else {
        await seed();
        const reloaded = await db.select().from(products);
        if (reloaded && reloaded.length > 0) {
          allProducts = reloaded;
        }
      }
    } catch (e) {
      console.warn("PostgreSQL not accessible, using built-in catalog:", e);
    }
  }


  // Hotfix: Replace broken Pexels images with local fallbacks before passing to client
  allProducts = allProducts.map((p, i) => {
    const localImages = [
      "/products/corduroy_utility_jacket_01.jpg",
      "/products/corduroy_utility_jacket_02.jpg",
      "/products/corduroy_utility_jacket_03.jpg",
      "/products/greenvel_luxe.jpg"
    ];
    let p2 = { ...p };
    if (p2.primaryImage && p2.primaryImage.includes('pexels.com')) {
      p2.primaryImage = localImages[i % localImages.length];
    }
    if (p2.secondaryImage && p2.secondaryImage.includes('pexels.com')) {
      p2.secondaryImage = localImages[(i + 1) % localImages.length];
    }
    return p2;
  });

  return <DrevExperience products={allProducts} />;
}
