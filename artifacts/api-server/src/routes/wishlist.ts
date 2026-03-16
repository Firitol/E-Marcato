import { Router } from "express";
import { db } from "@workspace/db";
import { wishlistTable, productsTable, categoriesTable, sellersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const items = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, userId));
    const products = await Promise.all(items.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
      if (!product) return null;
      const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
      const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.id, product.sellerId)).limit(1);
      return { ...product, price: parseFloat(product.price), rating: parseFloat(product.rating || "0"), categoryName: cat?.name, sellerName: seller?.storeName };
    }));
    res.json(products.filter(Boolean));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.body;
    const existing = await db.select().from(wishlistTable).where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId))).limit(1);
    if (existing.length === 0) {
      await db.insert(wishlistTable).values({ userId, productId });
    }
    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:productId", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.productId);
    await db.delete(wishlistTable).where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)));
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
