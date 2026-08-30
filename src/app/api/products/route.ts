import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, Product } from "@/db/schema";
import { initialProducts } from "@/db/seed";
import { eq } from "drizzle-orm";

// In-memory catalog cache for zero-config live edits
let dynamicProducts: Product[] = [...initialProducts];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    let allProducts = dynamicProducts;

    if (process.env.DATABASE_URL) {
      try {
        const dbProducts = await db.select().from(products);
        if (dbProducts && dbProducts.length > 0) {
          allProducts = dbProducts;
        }
      } catch (dbErr) {
        console.warn("DB query failed, using dynamic catalog:", dbErr);
      }
    }

    let filtered = [...allProducts];

    if (category && category.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured);
    }

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return NextResponse.json({
      success: true,
      products: filtered,
      count: filtered.length,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Add new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const maxId = dynamicProducts.reduce((max, p) => Math.max(max, p.id || 0), 0);
    const newProduct: Product = {
      id: maxId + 1,
      slug:
        body.slug ||
        (body.name ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `product-${maxId + 1}`),
      name: body.name || "UNTITLED OBJECT",
      category: body.category || "Outerwear",
      price: Number(body.price) || 850,
      currency: body.currency || "USD",
      color: body.color || "Obsidian Noir",
      colorHex: body.colorHex || "#111111",
      description: body.description || "",
      fabricDetails: body.fabricDetails || "",
      fitInfo: body.fitInfo || "",
      origin: body.origin || "Atelier Production",
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ["M", "L", "XL"],
      primaryImage: body.primaryImage || "/products/greenvel_luxe.jpg",
      secondaryImage: body.secondaryImage || body.primaryImage || "/products/greenvel_luxe.jpg",
      campaignLook: body.campaignLook || "NEW ARRIVAL",
      inStock: body.inStock !== false,
      featured: body.featured === true,
      badge: body.badge || "NEW ARRIVAL",
      createdAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      try {
        await db.insert(products).values(newProduct);
      } catch (dbErr) {
        console.warn("DB insertion failed, updated in-memory:", dbErr);
      }
    }

    dynamicProducts = [newProduct, ...dynamicProducts];

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT: Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const index = dynamicProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...dynamicProducts[index],
      ...body,
      id,
      price: body.price !== undefined ? Number(body.price) : dynamicProducts[index].price,
    };

    if (process.env.DATABASE_URL) {
      try {
        await db.update(products).set(updatedProduct).where(eq(products.id, id));
      } catch (dbErr) {
        console.warn("DB update failed, updated in-memory:", dbErr);
      }
    }

    dynamicProducts[index] = updatedProduct;

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Remove product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const id = Number(idParam);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        await db.delete(products).where(eq(products.id, id));
      } catch (dbErr) {
        console.warn("DB delete failed, removed from in-memory:", dbErr);
      }
    }

    dynamicProducts = dynamicProducts.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
