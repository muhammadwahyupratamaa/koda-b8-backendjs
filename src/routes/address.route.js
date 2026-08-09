import express from "express";
import addressController from "../controllers/address.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", addressController.getAll);
router.get("/:id", addressController.getById);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.remove);
router.patch("/:id/primary", addressController.setPrimary);

export default router;
