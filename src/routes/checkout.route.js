import { Router } from "express";
import checkoutController from "../controllers/checkout.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * tags:
 *   name: Checkout
 *   description: Checkout and Order Management API
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Checkout shopping cart
 *     description: Create an order from all items in the authenticated user's shopping cart.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Checkout completed successfully
 *       400:
 *         description: Shopping cart is empty
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shopping cart not found
 *       500:
 *         description: Internal server error
 */
router.post("/", checkoutController.checkout);

/**
 * @swagger
 * /checkout/orders:
 *   get:
 *     summary: Get order history
 *     description: Retrieve all orders belonging to the authenticated user.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/orders", checkoutController.getOrders);

export default router;
