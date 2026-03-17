import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, sellersTable, usersTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, desc, asc, sql } from "drizzle-orm";
import { requireAuth, optionalAuth } from "../lib/auth.js";

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
}

async function enrichProduct(product: any) {
  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
  const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.id, product.sellerId)).limit(1);
  return {
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
    rating: parseFloat(product.rating || "0"),
    categoryName: category?.name,
    sellerName: seller?.storeName,
  };
}

router.get("/", optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const { category, sellerId, minPrice, maxPrice, sort, featured } = req.query;

    let conditions: any[] = [eq(productsTable.status, "active")];

    if (category) {
      const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category as string)).limit(1);
      if (cat) conditions.push(eq(productsTable.categoryId, cat.id));
    }
    if (sellerId) conditions.push(eq(productsTable.sellerId, parseInt(sellerId as string)));
    if (minPrice) conditions.push(gte(productsTable.price, minPrice as string));
    if (maxPrice) conditions.push(lte(productsTable.price, maxPrice as string));
    if (featured === "true") conditions.push(eq(productsTable.featured, true));

    let orderBy: any;
    switch (sort) {
      case "price_asc": orderBy = asc(productsTable.price); break;
      case "price_desc": orderBy = desc(productsTable.price); break;
      case "rating": orderBy = desc(productsTable.rating); break;
      case "popular": orderBy = desc(productsTable.sold); break;
      default: orderBy = desc(productsTable.createdAt);
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];
    const products = await db.select().from(productsTable).where(where).orderBy(orderBy).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(where);

    const enriched = await Promise.all(products.map(enrichProduct));
    res.json({
      products: enriched,
      total: Number(count),
      page,
      totalPages: Math.ceil(Number(count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.userId, userId)).limit(1);
    if (!seller || seller.status !== "approved") {
      res.status(403).json({ error: "Forbidden", message: "Only approved sellers can create products" });
      return;
    }

    const { name, description, price, originalPrice, stock, categoryId, images, tags, specifications } = req.body;
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

    const [product] = await db.insert(productsTable).values({
      name,
      slug: slugify(name),
      description,
      price: price.toString(),
      originalPrice: originalPrice?.toString(),
      discount,
      stock,
      categoryId,
      sellerId: seller.id,
      images: images || [],
      tags: tags || [],
      specifications: specifications || {},
      status: "pending",
    }).returning();

    res.status(201).json(await enrichProduct(product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id), 10);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (!product) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
    const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.id, product.sellerId)).limit(1);

    res.json({
      ...product,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      rating: parseFloat(product.rating || "0"),
      categoryName: category?.name,
      sellerName: seller?.storeName,
      seller: seller ? {
        id: seller.id,
        storeName: seller.storeName,
        logo: seller.logo,
        rating: parseFloat(seller.rating || "0"),
        totalSales: seller.totalSales,
        city: seller.city,
      } : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id), 10);
    const userId = (req as any).userId;
    const [seller] = await db.select().from(sellersTable).where(eq(sellersTable.userId, userId)).limit(1);

    const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: "Not Found" });
      return;
    }
    if (seller && existing.sellerId !== seller.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [updated] = await db.update(productsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();
    res.json(await enrichProduct(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number.parseInt(String(req.params.id), 10);
    await db.update(productsTable).set({ status: "inactive" }).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const { reviewsTable } = await import("@workspace/db");
    const id = Number.parseInt(String(req.params.id), 10);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const reviews = await db.select().from(reviewsTable)
      .where(eq(reviewsTable.productId, id))
      .orderBy(desc(reviewsTable.createdAt))
      .limit(limit).offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(reviewsTable).where(eq(reviewsTable.productId, id));

    const enrichedReviews = await Promise.all(reviews.map(async (review) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, review.userId)).limit(1);
      return {
        ...review,
        userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
        userAvatar: user?.avatar,
      };
    }));

    const totalCount = Number(count);
    const avgResult = await db.select({ avg: sql<number>`avg(rating)` })
      .from(reviewsTable).where(eq(reviewsTable.productId, id));

    res.json({
      reviews: enrichedReviews,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      averageRating: parseFloat(avgResult[0]?.avg?.toString() || "0"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
