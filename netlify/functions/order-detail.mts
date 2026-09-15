import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders, orderItems } from "../../db/schema.js";

export default async (_req: Request, context: Context) => {
  const orderNumber = context.params.orderNumber;
  if (!orderNumber) {
    return new Response("Not found", { status: 404 });
  }

  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  if (!order) {
    return new Response("Not found", { status: 404 });
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return Response.json({ order, items });
};

export const config: Config = {
  path: "/api/orders/:orderNumber",
};
