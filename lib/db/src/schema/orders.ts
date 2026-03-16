import { pgTable, serial, integer, text, varchar, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: integer("user_id").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address").$type<{
    fullName: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    country: string;
    landmark?: string;
  }>().notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  estimatedDelivery: timestamp("estimated_delivery"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
