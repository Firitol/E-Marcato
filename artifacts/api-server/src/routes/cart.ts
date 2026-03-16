import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

async function getCartWithProducts(userId: number) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.userId, userId));
  let subtotal = 0;
  const enriched = await Promise.all(items.map(async (item) => {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
    const price = parseFloat(item.price);
    const sub = price * item.quantity;
    subtotal += sub;
    return {
      productId: item.productId,
      product: product ? {
        ...product,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
        rating: parseFloat(product.rating || "0"),
      } : null,
      quantity: item.quantity,
      price,
      subtotal: sub,
    };
  }));
  const shipping = subtotal > 0 ? 150 : 0;
  return {
    items: enriched,
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: enriched.reduce((sum, i) => sum + i.quantity, 0),
  };
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    res.json(await getCartWithProducts(userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const [existing] = await db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId))).limit(1);

    if (existing) {
      await db.update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({
        userId,
        productId,
        quantity,
        price: product.price,
      });
    }

    res.json(await getCartWithProducts(userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:productId", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;

    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    } else {
      await db.update(cartItemsTable)
        .set({ quantity, updatedAt: new Date() })
        .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    }

    res.json(await getCartWithProducts(userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:productId", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const productId = parseInt(req.params.productId);
    await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    res.json(await getCartWithProducts(userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
