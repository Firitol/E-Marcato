import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, sellersTable } from "@workspace/db";
import { eq, desc, and, ne, sql } from "drizzle-orm";
import { optionalAuth } from "../lib/auth.js";

const router = Router();

async function enrichProducts(products: any[]) {
  return Promise.all(products.map(async (p) => {
    const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, p.categoryId)).limit(1);
    const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.id, p.sellerId)).limit(1);
    return {
      ...p,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : undefined,
      rating: parseFloat(p.rating || "0"),
      categoryName: cat?.name,
      sellerName: seller?.storeName,
    };
  }));
}

router.get("/homepage", optionalAuth, async (_req, res) => {
  try {
    const active = eq(productsTable.status, "active");

    const [featuredRaw, trendingRaw, dealsRaw, newArrivalsRaw] = await Promise.all([
      db.select().from(productsTable).where(and(active, eq(productsTable.featured, true))).limit(8),
      db.select().from(productsTable).where(active).orderBy(desc(productsTable.sold)).limit(10),
      db.select().from(productsTable).where(and(active, sql`discount > 0`)).orderBy(desc(productsTable.discount)).limit(8),
      db.select().from(productsTable).where(active).orderBy(desc(productsTable.createdAt)).limit(8),
    ]);

    const [featured, trending, deals, newArrivals] = await Promise.all([
      enrichProducts(featuredRaw),
      enrichProducts(trendingRaw),
      enrichProducts(dealsRaw),
      enrichProducts(newArrivalsRaw),
    ]);

    res.json({ featured, trending, forYou: trending.slice(0, 8), deals, newArrivals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/similar/:productId", async (req, res) => {
  try {
    const productId = Number.parseInt(String(req.params.productId), 10);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
      return;
    }

    const similar = await db.select().from(productsTable)
      .where(and(
        eq(productsTable.categoryId, product.categoryId),
        eq(productsTable.status, "active"),
        ne(productsTable.id, productId),
      ))
      .orderBy(desc(productsTable.rating)).limit(8);

    res.json(await enrichProducts(similar));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/trending", async (_req, res) => {
  try {
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.status, "active"))
      .orderBy(desc(productsTable.sold)).limit(12);
    res.json(await enrichProducts(products));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
