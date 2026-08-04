import { Router } from "express";
import authRoute from "./auth.route.js";
import productRoute from "./product.route.js";
import categoryRoute from "./category.route.js"

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/categories", categoryRoute)



export default router;
