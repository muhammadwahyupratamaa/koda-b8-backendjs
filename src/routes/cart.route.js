import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", cartController.addProduct);
router.patch("/:productId", cartController.updateQuantity);
router.delete("/:productId", cartController.removeProduct);
router.get("/", cartController.getAll);

export default router;
