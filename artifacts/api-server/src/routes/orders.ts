import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable, cartItemsTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

function generateOrderNumber(): string {
  return `ETH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
}

async function enrichOrder(order: any) {
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  const enrichedItems = await Promise.all(items.map(async (item) => {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
    return {
      ...item,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.subtotal),
      product: product ? { ...product, price: parseFloat(product.price), rating: parseFloat(product.rating || "0") } : null,
    };
  }));
  return {
    ...order,
    subtotal: parseFloat(order.subtotal),
    shipping: parseFloat(order.shipping),
    total: parseFloat(order.total),
    items: enrichedItems,
  };
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    let conditions: any[] = [eq(ordersTable.userId, userId)];
    if (status) conditions.push(eq(ordersTable.status, status as string));

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];
    const orders = await db.select().from(ordersTable).where(where)
      .orderBy(desc(ordersTable.createdAt)).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable).where(where);

    const enriched = await Promise.all(orders.map(enrichOrder));
    res.json({ orders: enriched, total: Number(count), page, totalPages: Math.ceil(Number(count) / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
      if (!product || product.stock < item.quantity) {
        res.status(400).json({ error: "Bad Request", message: `Insufficient stock for product ${item.productId}` });
        return;
      }
      const price = parseFloat(product.price);
      const sub = price * item.quantity;
      subtotal += sub;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price, subtotal: sub.toFixed(2) });
    }

    const shipping = 150;
    const total = subtotal + shipping;

    const [order] = await db.insert(ordersTable).values({
      orderNumber: generateOrderNumber(),
      userId,
      status: "pending",
      paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "pending",
      paymentMethod,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      shippingAddress,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    }).returning();

    await db.insert(orderItemsTable).values(orderItems.map(item => ({ orderId: order.id, ...item })));

    // Update stock
    for (const item of items) {
      await db.update(productsTable)
        .set({ stock: sql`stock - ${item.quantity}`, sold: sql`sold + ${item.quantity}` })
        .where(eq(productsTable.id, item.productId));
    }

    // Clear cart
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    res.status(201).json(await enrichOrder(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id), 10);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    res.json(await enrichOrder(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id/status", requireAuth, async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id), 10);
    const { status, trackingNumber, note } = req.body;
    const [order] = await db.update(ordersTable)
      .set({ status, trackingNumber, notes: note, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    res.json(await enrichOrder(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
