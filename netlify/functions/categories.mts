import type { Config } from "@netlify/functions";
import { sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

export default async () => {
  const rows = await db
    .select({
      category: products.category,
      count: sql<number>`count(*)::int`,
      icon: sql<string>`min(${products.imageIcon})`,
    })
    .from(products)
    .groupBy(products.category)
    .orderBy(sql`count(*) desc`);

  return Response.json({ categories: rows });
};

export const config: Config = {
  path: "/api/categories",
};
