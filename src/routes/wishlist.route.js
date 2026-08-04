import { Router } from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/", wishlistController.addProduct);
router.get("/", wishlistController.getAll);
router.delete("/:productId", wishlistController.removeProduct);

export default router;
