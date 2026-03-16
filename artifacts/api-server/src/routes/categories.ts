import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    const enriched = await Promise.all(categories.map(async (cat) => {
      const [{ count }] = await db.select({ count: sql<number>`count(*)` })
        .from(productsTable)
        .where(eq(productsTable.categoryId, cat.id));
      return { ...cat, productCount: Number(count) };
    }));
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
