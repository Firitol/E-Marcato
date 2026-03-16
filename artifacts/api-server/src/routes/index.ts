import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import searchRouter from "./search.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import paymentsRouter from "./payments.js";
import sellersRouter from "./sellers.js";
import reviewsRouter from "./reviews.js";
import recommendationsRouter from "./recommendations.js";
import wishlistRouter from "./wishlist.js";
import notificationsRouter from "./notifications.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/search", searchRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/payments", paymentsRouter);
router.use("/sellers", sellersRouter);
router.use("/reviews", reviewsRouter);
router.use("/recommendations", recommendationsRouter);
router.use("/wishlist", wishlistRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);

export default router;
