import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import adminController from "../controllers/admin.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/test", adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

router.get("/products", adminMiddleware, adminController.getProducts);
router.post("/products", adminMiddleware, adminController.createProduct);

export default router;
