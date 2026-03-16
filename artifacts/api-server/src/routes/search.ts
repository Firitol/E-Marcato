import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, sellersTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or, desc, asc, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { category, minPrice, maxPrice, sort } = req.query;

    let conditions: any[] = [
      eq(productsTable.status, "active"),
      or(
        ilike(productsTable.name, `%${q}%`),
        ilike(productsTable.description, `%${q}%`)
      ),
    ];

    if (category) {
      const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category as string)).limit(1);
      if (cat) conditions.push(eq(productsTable.categoryId, cat.id));
    }
    if (minPrice) conditions.push(gte(productsTable.price, minPrice as string));
    if (maxPrice) conditions.push(lte(productsTable.price, maxPrice as string));

    let orderBy: any;
    switch (sort) {
      case "price_asc": orderBy = asc(productsTable.price); break;
      case "price_desc": orderBy = desc(productsTable.price); break;
      case "rating": orderBy = desc(productsTable.rating); break;
      case "popular": orderBy = desc(productsTable.sold); break;
      default: orderBy = desc(productsTable.rating);
    }

    const where = and(...conditions);
    const products = await db.select().from(productsTable).where(where).orderBy(orderBy).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(where);

    const enriched = await Promise.all(products.map(async (p) => {
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

    res.json({ products: enriched, total: Number(count), page, totalPages: Math.ceil(Number(count) / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
