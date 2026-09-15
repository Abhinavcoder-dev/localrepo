import type { Config, Context } from "@netlify/functions";
import { eq, and, ne, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

export default async (_req: Request, context: Context) => {
  const slug = context.params.slug;
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  const [product] = await db.select().from(products).where(eq(products.slug, slug));
  if (!product) {
    return new Response("Not found", { status: 404 });
  }

  const related = await db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), ne(products.id, product.id)))
    .orderBy(desc(products.ratingCount))
    .limit(6);

  return Response.json({ product, related });
};

export const config: Config = {
  path: "/api/products/:slug",
};
