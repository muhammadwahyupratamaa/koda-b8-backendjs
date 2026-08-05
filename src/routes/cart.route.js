import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * tags:
 *   name: Shopping Cart
 *   description: Shopping Cart Management API
 */

/**
 * @openapi
 * /cart:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the authenticated user's shopping cart.
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", cartController.addProduct);

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get shopping cart
 *     description: Retrieve all products in the authenticated user's shopping cart.
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shopping cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", cartController.getAll);

/**
 * @openapi
 * /cart/{productId}:
 *   patch:
 *     summary: Update product quantity
 *     description: Update the quantity of a product in the shopping cart.
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:productId", cartController.updateQuantity);

/**
 * @openapi
 * /cart/{productId}:
 *   delete:
 *     summary: Remove product from shopping cart
 *     description: Remove a product from the authenticated user's shopping cart.
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:productId", cartController.removeProduct);

export default router;
