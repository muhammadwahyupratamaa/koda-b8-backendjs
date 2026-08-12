import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import adminController from "../controllers/admin.controller.js";

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

router.get("/test", adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

router.get("/products", adminController.getProducts);
router.get("/products/:id", adminController.getProductByID);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
export default router;
