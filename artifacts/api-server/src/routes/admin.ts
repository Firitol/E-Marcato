import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, sellersTable, productsTable, ordersTable } from "@workspace/db";
import { eq, desc, ilike, and, sql, or } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth.js";

const router = Router();
const requireAdmin = [requireAuth, requireRole("admin")];

router.get("/dashboard", ...requireAdmin, async (_req, res) => {
  try {
    const [[{ totalUsers }], [{ totalSellers }], [{ totalProducts }], [{ totalOrders }], [{ totalRevenue }]] = await Promise.all([
      db.select({ totalUsers: sql<number>`count(*)` }).from(usersTable),
      db.select({ totalSellers: sql<number>`count(*)` }).from(sellersTable),
      db.select({ totalProducts: sql<number>`count(*)` }).from(productsTable),
      db.select({ totalOrders: sql<number>`count(*)` }).from(ordersTable),
      db.select({ totalRevenue: sql<number>`coalesce(sum(total), 0)` }).from(ordersTable).where(eq(ordersTable.paymentStatus, "paid")),
    ]);

    const [[{ pendingSellers }], [{ pendingProducts }]] = await Promise.all([
      db.select({ pendingSellers: sql<number>`count(*)` }).from(sellersTable).where(eq(sellersTable.status, "pending")),
      db.select({ pendingProducts: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.status, "pending")),
    ]);

    const revenueChart = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      return { date: date.toISOString().split("T")[0], value: Math.floor(Math.random() * 20000) + 5000 };
    });

    const recentOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5);

    res.json({
      totalUsers: Number(totalUsers),
      totalSellers: Number(totalSellers),
      totalProducts: Number(totalProducts),
      totalOrders: Number(totalOrders),
      totalRevenue: parseFloat(totalRevenue?.toString() || "0"),
      pendingSellers: Number(pendingSellers),
      pendingProducts: Number(pendingProducts),
      revenueChart,
      orderStatusBreakdown: [
        { status: "delivered", count: 120, percentage: 45 },
        { status: "processing", count: 80, percentage: 30 },
        { status: "pending", count: 67, percentage: 25 },
      ],
      topCategories: [
        { id: 1, name: "Electronics", count: 450, revenue: 250000 },
        { id: 2, name: "Fashion", count: 380, revenue: 180000 },
        { id: 3, name: "Food & Beverages", count: 320, revenue: 95000 },
      ],
      recentOrders: recentOrders.map(o => ({
        ...o,
        subtotal: parseFloat(o.subtotal),
        shipping: parseFloat(o.shipping),
        total: parseFloat(o.total),
        items: [],
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users", ...requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { role, search } = req.query;

    let conditions: any[] = [];
    if (role) conditions.push(eq(usersTable.role, role as string));
    if (search) conditions.push(or(ilike(usersTable.email, `%${search}%`), ilike(usersTable.firstName, `%${search}%`)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      phone: usersTable.phone,
      role: usersTable.role,
      avatar: usersTable.avatar,
      city: usersTable.city,
      isActive: usersTable.isActive,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(where).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(usersTable).where(where);
    res.json({ users, total: Number(count), page, totalPages: Math.ceil(Number(count) / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/sellers", ...requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    const conditions: any[] = [];
    if (status) conditions.push(eq(sellersTable.status, status as string));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sellers = await db.select().from(sellersTable).where(where)
      .orderBy(desc(sellersTable.createdAt)).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(sellersTable).where(where);

    res.json({
      sellers: sellers.map(s => ({ ...s, rating: parseFloat(s.rating || "0") })),
      total: Number(count), page, totalPages: Math.ceil(Number(count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/sellers/:id/approve", ...requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, reason } = req.body;
    const [seller] = await db.update(sellersTable)
      .set({ status, rejectionReason: reason, updatedAt: new Date() })
      .where(eq(sellersTable.id, id)).returning();
    res.json({ ...seller, rating: parseFloat(seller.rating || "0") });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders", ...requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    const conditions: any[] = [];
    if (status) conditions.push(eq(ordersTable.status, status as string));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orders = await db.select().from(ordersTable).where(where)
      .orderBy(desc(ordersTable.createdAt)).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable).where(where);

    res.json({
      orders: orders.map(o => ({
        ...o, subtotal: parseFloat(o.subtotal), shipping: parseFloat(o.shipping), total: parseFloat(o.total), items: [],
      })),
      total: Number(count), page, totalPages: Math.ceil(Number(count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/pending", ...requireAdmin, async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.status, "pending"))
      .orderBy(desc(productsTable.createdAt));
    res.json({
      products: products.map(p => ({ ...p, price: parseFloat(p.price), rating: parseFloat(p.rating || "0") })),
      total: products.length, page: 1, totalPages: 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/products/:id/approve", ...requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const [product] = await db.update(productsTable).set({ status, updatedAt: new Date() })
      .where(eq(productsTable.id, id)).returning();
    res.json({ ...product, price: parseFloat(product.price), rating: parseFloat(product.rating || "0") });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/analytics", ...requireAdmin, async (req, res) => {
  try {
    const [[{ revenue }], [{ orders }], [{ users }], [{ sellers }]] = await Promise.all([
      db.select({ revenue: sql<number>`coalesce(sum(total), 0)` }).from(ordersTable),
      db.select({ orders: sql<number>`count(*)` }).from(ordersTable),
      db.select({ users: sql<number>`count(*)` }).from(usersTable),
      db.select({ sellers: sql<number>`count(*)` }).from(sellersTable),
    ]);

    const period = req.query.period as string || "30d";
    const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "1y" ? 365 : 30;

    const revenueChart = Array.from({ length: days > 30 ? 12 : days }, (_, i) => ({
      date: new Date(Date.now() - (days - i * (days > 30 ? days / 12 : 1)) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 50000) + 10000,
    }));

    res.json({
      revenue: parseFloat(revenue?.toString() || "0"),
      orders: Number(orders),
      users: Number(users),
      sellers: Number(sellers),
      revenueChart,
      userGrowthChart: revenueChart.map(d => ({ date: d.date, value: Math.floor(Math.random() * 50) + 5 })),
      categoryRevenue: [
        { id: 1, name: "Electronics", count: 450, revenue: 250000 },
        { id: 2, name: "Fashion", count: 380, revenue: 180000 },
        { id: 3, name: "Food & Beverages", count: 320, revenue: 95000 },
        { id: 4, name: "Home & Garden", count: 210, revenue: 75000 },
        { id: 5, name: "Health & Beauty", count: 180, revenue: 65000 },
      ],
      paymentMethods: [
        { status: "Telebirr", count: 450, percentage: 55 },
        { status: "CBE Birr", count: 280, percentage: 34 },
        { status: "Cash on Delivery", count: 90, percentage: 11 },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
