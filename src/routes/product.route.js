import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/category/:id", productController.getByCategory);
router.get("/:id", productController.getById);

export default router;
