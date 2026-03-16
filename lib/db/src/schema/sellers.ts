import { pgTable, serial, integer, text, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sellersTable = pgTable("sellers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  storeName: varchar("store_name", { length: 200 }).notNull(),
  storeDescription: text("store_description"),
  logo: text("logo"),
  category: varchar("category", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  bankName: varchar("bank_name", { length: 100 }),
  accountNumber: varchar("account_number", { length: 50 }),
  tinNumber: varchar("tin_number", { length: 50 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  totalSales: integer("total_sales").default(0),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSellerSchema = createInsertSchema(sellersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellersTable.$inferSelect;
