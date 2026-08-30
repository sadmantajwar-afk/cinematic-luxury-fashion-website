import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  color: text("color").notNull(),
  colorHex: text("color_hex").notNull().default("#000000"),
  description: text("description").notNull(),
  fabricDetails: text("fabric_details").notNull(),
  fitInfo: text("fit_info").notNull(),
  origin: text("origin").notNull().default("Made in Japan"),
  sizes: jsonb("sizes").$type<string[]>().notNull(),
  primaryImage: text("primary_image").notNull(),
  secondaryImage: text("secondary_image").notNull(),
  campaignLook: text("campaign_look"),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  badge: text("badge"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  items: jsonb("items").$type<Array<{
    productId: number;
    slug: string;
    name: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image: string;
  }>>().notNull(),
  subtotal: integer("subtotal").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("CONFIRMED"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
