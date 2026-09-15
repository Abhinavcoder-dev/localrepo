import type { Config } from "@netlify/functions";
import { eq, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products, orders, orderItems } from "../../db/schema.js";

const TAX_RATE = 0.0725;
const FREE_SHIPPING_THRESHOLD = 3500;
const FLAT_SHIPPING_CENTS = 499;

function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 7; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `PL-${suffix}`;
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => null);
  const items: Array<{ productId: number; quantity: number }> = body?.items ?? [];
  const customer = body?.customer ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const required = ["name", "email", "addressLine1", "city", "state", "zip"];
  for (const field of required) {
    if (!customer[field] || String(customer[field]).trim() === "") {
      return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const productIds = items.map((i) => Number(i.productId));
  const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotalCents = 0;
  const resolvedItems: Array<{ productId: number; productName: string; unitPriceCents: number; quantity: number }> = [];

  for (const item of items) {
    const product = productMap.get(Number(item.productId));
    const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
    if (!product) {
      return Response.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }
    if (product.stock < quantity) {
      return Response.json({ error: `Only ${product.stock} left of "${product.name}".` }, { status: 400 });
    }
    subtotalCents += product.priceCents * quantity;
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      unitPriceCents: product.priceCents,
      quantity,
    });
  }

  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: String(customer.name),
      email: String(customer.email),
      addressLine1: String(customer.addressLine1),
      addressLine2: customer.addressLine2 ? String(customer.addressLine2) : null,
      city: String(customer.city),
      state: String(customer.state),
      zip: String(customer.zip),
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
    })
    .returning();

  await db.insert(orderItems).values(
    resolvedItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
    })),
  );

  for (const item of resolvedItems) {
    const product = productMap.get(item.productId)!;
    await db
      .update(products)
      .set({ stock: product.stock - item.quantity })
      .where(eq(products.id, item.productId));
  }

  return Response.json({ orderNumber: order.orderNumber }, { status: 201 });
};

export const config: Config = {
  path: "/api/checkout",
  method: "POST",
};
