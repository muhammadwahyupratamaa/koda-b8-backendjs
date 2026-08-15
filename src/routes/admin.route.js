import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import adminController from "../controllers/admin.controller.js";
import upload from "../middlewares/upload.middleware.js";
import uploadError from "../middlewares/uploadError.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin management API
 */

/**
 * @openapi
 * /admin/test:
 *   get:
 *     summary: Test admin access
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

/**
 * @openapi
 * /admin/products:
 *   get:
 *     summary: Get admin products
 *     description: Retrieve products with search, category filter, status filter, and pagination.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search product by name or brand.
 *         example: iPhone
 *
 *       - in: query
 *         name: category_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter products by category ID.
 *         example: 1
 *
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - active
 *             - promo
 *             - inactive
 *         description: Filter products by stock or promotion status.
 *         example: active
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of products per page.
 *
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/products", adminController.getProducts);

/**
 * @openapi
 * /admin/products/statistics:
 *   get:
 *     summary: Get product statistics
 *     description: Retrieve product management statistics.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 51
 *                     active:
 *                       type: integer
 *                       example: 51
 *                     lowStock:
 *                       type: integer
 *                       example: 0
 *                     promo:
 *                       type: integer
 *                       example: 51
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/products/statistics", adminController.getProductStatistics);

/**
 * @openapi
 * /admin/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve detailed information about a specific product.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 52
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/products/:id", adminController.getProductByID);

/**
 * @openapi
 * /admin/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a product and optionally upload a product image to Cloudinary.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - category_id
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 17 Pro Max
 *
 *               brand:
 *                 type: string
 *                 example: Apple
 *
 *               category_id:
 *                 type: integer
 *                 example: 1
 *
 *               price:
 *                 type: integer
 *                 example: 24990000
 *
 *               price_disc:
 *                 type: integer
 *                 nullable: true
 *                 example: 24500000
 *
 *               discount:
 *                 type: integer
 *                 example: 5
 *
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 4.8
 *
 *               review:
 *                 type: integer
 *                 example: 120
 *
 *               sold:
 *                 type: integer
 *                 example: 500
 *
 *               stock:
 *                 type: integer
 *                 example: 39
 *
 *               is_featured:
 *                 type: boolean
 *                 example: false
 *
 *               description:
 *                 type: string
 *                 example: Smartphone flagship terbaru Apple.
 *
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image. Maximum 2 MB and must be an image.
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request or invalid image file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/products",
  upload.single("image"),
  uploadError,
  adminController.createProduct,
);

/**
 * @openapi
 * /admin/products/{id}:
 *   put:
 *     summary: Update product
 *     description: Update product information and optionally replace the product image.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 52
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 17 Pro Max
 *
 *               brand:
 *                 type: string
 *                 example: Apple
 *
 *               category_id:
 *                 type: integer
 *                 example: 1
 *
 *               price:
 *                 type: integer
 *                 example: 24990000
 *
 *               price_disc:
 *                 type: integer
 *                 nullable: true
 *                 example: 24500000
 *
 *               discount:
 *                 type: integer
 *                 example: 5
 *
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 4.8
 *
 *               review:
 *                 type: integer
 *                 example: 120
 *
 *               sold:
 *                 type: integer
 *                 example: 500
 *
 *               stock:
 *                 type: integer
 *                 example: 39
 *
 *               is_featured:
 *                 type: boolean
 *                 example: false
 *
 *               description:
 *                 type: string
 *                 example: Updated product description.
 *
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new product image. Maximum 2 MB.
 *
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request or invalid image file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/products/:id",
  upload.single("image"),
  uploadError,
  adminController.updateProduct,
);

/**
 * @openapi
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Delete a product from the system.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 52
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/products/:id", adminController.deleteProduct);

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: Get admin orders
 *     description: Retrieve orders with search, status filter, and pagination.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search order by order ID, user ID, customer name, or customer email.
 *         example: Bildan
 *
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - processing
 *             - shipped
 *             - delivered
 *         description: Filter orders by status.
 *         example: pending
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of orders per page.
 *
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/orders", adminController.getOrders);

/**
 * @openapi
 * /admin/orders/statistics:
 *   get:
 *     summary: Get order statistics
 *     description: Retrieve order statistics by status.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 29
 *                     pending:
 *                       type: integer
 *                       example: 23
 *                     processing:
 *                       type: integer
 *                       example: 0
 *                     shipped:
 *                       type: integer
 *                       example: 0
 *                     delivered:
 *                       type: integer
 *                       example: 6
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/orders/statistics", adminController.getOrderStatistics);

/**
 * @openapi
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Update an order to the next valid status in the order flow.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 19
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status or invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch("/orders/:id/status", adminController.updateOrderStatus);

export default router;
