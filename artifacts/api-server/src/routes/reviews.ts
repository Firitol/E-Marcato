import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, productsTable, usersTable, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { productId, rating, comment, images } = req.body;

    // Check if user purchased product
    const purchases = await db.select().from(orderItemsTable)
      .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(and(eq(ordersTable.userId, userId), eq(orderItemsTable.productId, productId)))
      .limit(1);
    const verifiedPurchase = purchases.length > 0;

    const [review] = await db.insert(reviewsTable).values({
      productId,
      userId,
      rating,
      comment,
      images: images || [],
      verifiedPurchase,
    }).returning();

    // Update product rating
    const [{ avg, cnt }] = await db.select({
      avg: sql<number>`avg(rating)`,
      cnt: sql<number>`count(*)`,
    }).from(reviewsTable).where(eq(reviewsTable.productId, productId));

    await db.update(productsTable).set({
      rating: parseFloat(avg?.toString() || "0").toFixed(2),
      reviewCount: Number(cnt),
      updatedAt: new Date(),
    }).where(eq(productsTable.id, productId));

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.status(201).json({
      ...review,
      userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
