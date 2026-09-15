import type { Config } from "@netlify/functions";
import { and, asc, desc, gte, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

const PAGE_SIZE = 24;

export default async (req: Request) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const category = url.searchParams.get("category")?.trim() ?? "";
  const minRating = Number(url.searchParams.get("minRating") ?? 0);
  const sort = url.searchParams.get("sort") ?? "relevance";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));

  const conditions = [];
  if (q) {
    conditions.push(
      or(ilike(products.name, `%${q}%`), ilike(products.brand, `%${q}%`), ilike(products.category, `%${q}%`)),
    );
  }
  if (category) {
    conditions.push(sql`${products.category} = ${category}`);
  }
  if (minRating > 0) {
    conditions.push(gte(products.rating, String(minRating)));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    sort === "price-asc"
      ? asc(products.priceCents)
      : sort === "price-desc"
        ? desc(products.priceCents)
        : sort === "rating"
          ? desc(products.rating)
          : sort === "newest"
            ? desc(products.createdAt)
            : asc(products.id);

  const [rows, countRow] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(orderBy)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(where),
  ]);

  return Response.json({
    items: rows,
    page,
    pageSize: PAGE_SIZE,
    total: countRow[0]?.count ?? 0,
  });
};

export const config: Config = {
  path: "/api/products",
};
