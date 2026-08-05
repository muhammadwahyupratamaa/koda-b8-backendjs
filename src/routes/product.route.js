import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Product Management API
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", productController.getAll);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getById);

/**
 * @openapi
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get("/category/:id", productController.getByCategory);

export default router;
