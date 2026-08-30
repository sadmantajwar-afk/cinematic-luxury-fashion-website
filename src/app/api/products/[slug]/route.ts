import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { initialProducts } from "@/db/seed";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    let foundProduct = initialProducts.find((p) => p.slug === slug) || null;

    if (process.env.DATABASE_URL) {
      try {
        const [dbProduct] = await db
          .select()
          .from(products)
          .where(eq(products.slug, slug))
          .limit(1);

        if (dbProduct) {
          foundProduct = dbProduct;
        }
      } catch (dbErr) {
        console.warn("DB product lookup failed, using static product:", dbErr);
      }
    }

    if (!foundProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: foundProduct });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
