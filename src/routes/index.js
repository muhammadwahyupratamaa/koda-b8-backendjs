import { Router } from "express";
import authRoute from "./auth.route.js";
import productRoute from "./product.route.js";
import categoryRoute from "./category.route.js";
import wishlistRoute from "./wishlist.route.js";
import cartRoute from "./cart.route.js";
import checkoutRoute from "./checkout.route.js";
import profileRoute from "./profile.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/wishlist", wishlistRoute);
router.use("/cart", cartRoute);
router.use("/profile", profileRoute);
router.use("/checkout", checkoutRoute);

export default router;
