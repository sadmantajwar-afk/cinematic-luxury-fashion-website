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

  return <DrevExperience products={allProducts} />;
}
