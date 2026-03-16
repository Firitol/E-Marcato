import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import crypto from "crypto";

const router = Router();

// Stub payment processors for Ethiopian payment methods
const paymentStubs = {
  telebirr: async (amount: number, phone: string, orderId: number) => {
    const transactionId = `TLB-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    return {
      transactionId,
      method: "telebirr",
      amount,
      status: "pending",
      ussd: `*127*6*${transactionId}#`,
      message: `Dial *127*6*${transactionId}# on your Telebirr to confirm payment of ETB ${amount}`,
    };
  },
  cbe_birr: async (amount: number, phone: string, orderId: number) => {
    const transactionId = `CBE-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    return {
      transactionId,
      method: "cbe_birr",
      amount,
      status: "pending",
      ussd: `*847*${transactionId}#`,
      message: `Dial *847*${transactionId}# on your CBE Birr to confirm payment of ETB ${amount}`,
    };
  },
  cash_on_delivery: async (amount: number, _phone: string, orderId: number) => {
    const transactionId = `COD-${orderId}-${Date.now()}`;
    return {
      transactionId,
      method: "cash_on_delivery",
      amount,
      status: "pending",
      message: `Your order will be delivered and you pay ETB ${amount} upon delivery.`,
    };
  },
};

router.post("/initiate", requireAuth, async (req, res) => {
  try {
    const { orderId, method, amount, phone } = req.body;
    const stub = paymentStubs[method as keyof typeof paymentStubs];
    if (!stub) {
      res.status(400).json({ error: "Unsupported payment method" });
      return;
    }
    const result = await stub(amount, phone || "", orderId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/confirm", requireAuth, async (req, res) => {
  try {
    const { transactionId, orderId, otp } = req.body;
    // Simulate payment confirmation (in production, verify with actual payment gateway)
    const isCOD = transactionId.startsWith("COD-");
    const paymentStatus = isCOD ? "pending" : "paid";
    const orderStatus = isCOD ? "confirmed" : "processing";

    await db.update(ordersTable)
      .set({ paymentStatus, status: orderStatus, updatedAt: new Date() })
      .where(eq(ordersTable.id, orderId));

    res.json({
      success: true,
      transactionId,
      orderId,
      message: isCOD ? "Order confirmed! Pay on delivery." : "Payment confirmed successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
