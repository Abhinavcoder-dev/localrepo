import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial().primaryKey(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  brand: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  priceCents: integer("price_cents").notNull(),
  listPriceCents: integer("list_price_cents").notNull(),
  rating: numeric({ precision: 2, scale: 1 }).notNull(),
  ratingCount: integer("rating_count").notNull(),
  stock: integer().notNull(),
  badge: text(),
  imageHue: integer("image_hue").notNull(),
  imageIcon: text("image_icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text().notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text().notNull(),
  state: text().notNull(),
  zip: text().notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text().notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial().primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer().notNull(),
});
