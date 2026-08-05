import { Router } from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

/**
 * @openapi
 * tags:
 *   name: Wishlist
 *   description: Wishlist Management API
 */

/**
 * @openapi
 * /wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the authenticated user's wishlist.
 *     tags: [Wishlist]
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
 *         description: Product added to wishlist successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", wishlistController.addProduct);

/**
 * @openapi
 * /wishlist:
 *   get:
 *     summary: Get user wishlist
 *     description: Retrieve all wishlist items for the authenticated user.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", wishlistController.getAll);

/**
 * @openapi
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Remove a product from the authenticated user's wishlist.
 *     tags: [Wishlist]
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
router.delete("/:productId", wishlistController.removeProduct);

export default router;
